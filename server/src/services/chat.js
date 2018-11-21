const {
  Message, Group, UserGroup, User,
} = require('../models');

function formWhere({ id, before, after }) {
  let idCond;

  if (after) {
    idCond = {
      $gt: after,
    };
  }
  if (before) {
    idCond = {
      $lt: before,
    };
  }

  const where = {
    _id: idCond,
    groupId: id,
  };


  if (!idCond) {
    delete where._id;
  }

  return where;
}

async function getPageInfo({
  messages, groupId, before, after,
}) {
  if (messages.length === 0) {
    const isPrev = await Message.findOne({
      groupId,
      _id: { $lt: before || after },
    });
    const isNext = await Message.findOne({
      groupId,
      _id: { $gt: before || after },
    });

    return {
      hasPreviousPage: !!isPrev,
      hasNextPage: !!isNext,
    };
  }

  const isPrev = await Message.findOne({
    groupId,
    _id: {
      $lt: messages[0].id,
    },
  });
  const isNext = await Message.findOne({
    groupId,
    _id: {
      $gt: messages[messages.length - 1].id,
    },
  });

  return {
    hasPreviousPage: !!isPrev,
    hasNextPage: !!isNext,
  };
}

async function getDirectChats(user) {
  const usersGroups = await UserGroup.find({ userId: user.id });

  const directsRaw = await Group.find({
    _id: {
      $in: usersGroups.map(u => u.groupId),
    },
    code: {
      $exists: true,
    },
  }).sort({ lastMessageAt: -1 });

  const directs = directsRaw.map(d => ({
    ...d,
    name: d.code
      .split('|')
      .filter(dId => dId !== user.id)[0] || user.id,
    id: d._id.toString(),
  }));

  const users = await User.find({
    _id: {
      $in: directs.map(d => d.name),
    },
  });

  const res = directs.map(d => ({
    ...d,
    name: (users.find(u => u.id === d.name) || {}).email,
  }));

  return res.filter(r => r.name);
}

async function searchMessages(user, regExp) {
  const res = await UserGroup.aggregate([{
    $match: {
      userId: user._id,
    },
  }, {
    $graphLookup: {
      from: 'messages',
      startWith: '$groupId',
      connectFromField: 'groupId',
      connectToField: 'groupId',
      as: 'messages',
    },
  }, {
    $unwind: '$messages',
  }, {
    $match: {
      'messages.text': regExp,
    },
  }]);

  return res.map(r => r.messages);
}

module.exports = {
  getPageInfo,
  formWhere,
  getDirectChats,
  searchMessages,
};
