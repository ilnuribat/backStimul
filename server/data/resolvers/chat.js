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

  return directs.map(d => ({
    ...d,
    name: users.find(u => u.id === d.name).email,
  }));
}

module.exports = {
  getPageInfo,
  formWhere,
  getDirectChats,
};
