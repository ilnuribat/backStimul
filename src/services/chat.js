const { Types: { ObjectId } } = require('mongoose');
const {
  Message, Group, UserGroup, User,
} = require('../models');
const { ERROR_CODES } = require('./constants');

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
  const usersGroups = await UserGroup.find({
    userId: user.id,
    type: 'CHAT',
  });

  const directsRaw = await Group.find({
    _id: {
      $in: usersGroups.map(u => u.groupId),
    },
    type: 'DIRECT',
  }).sort({ lastMessageAt: -1 }).lean();

  const directs = directsRaw.map(d => ({
    ...d,
    ids: d.code
      .split('|')
      .filter(dId => dId !== user.id)[0] || user.id,
    id: d._id.toString(),
    _id: d._id,
  }));

  const users = await User.find({
    _id: {
      $in: directs.map(d => d.ids),
    },
  });

  const res = directs.map(d => ({
    ...d,
    name: (users.find(u => u.id === d.ids) || {}).email,
  }));

  return res.filter(r => r.name);
}

async function searchMessages(user, regExp, limit = 10) {
  const res = await UserGroup.aggregate([{
    $match: {
      userId: user._id,
      type: 'CHAT',
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
  }, {
    $limit: limit,
  }]);

  return res.map(r => r.messages);
}

async function directMessage(parent, { id }, { user }) {
  if (user._id.toString() === id) {
    throw new Error('FORBIDDEN to chat with yourselves');
  }
  const dUser = await User.findById(id);

  if (!dUser) {
    throw new Error(ERROR_CODES.NO_USER_FOUND);
  }

  const ids = [user._id, dUser.id].sort();

  // try to create such group
  let group;

  try {
    group = await Group.create({
      name: ids.join(', '),
      code: ids.join('|'),
      type: 'DIRECT',
    });
  } catch (err) {
    /* istanbul ignore else */
    if (err.errmsg && err.errmsg.indexOf('duplicate key error') > -1) {
      return Group.findOne({ code: ids.join('|') });
    }

    /* istanbul ignore next */
    throw err;
  }

  await UserGroup.insertMany([{
    userId: user.id,
    groupId: group.id,
    lastReadCursor: ObjectId.createFromTime(0),
    type: 'CHAT',
  }, {
    userId: dUser.id,
    groupId: group.id,
    lastReadCursor: ObjectId.createFromTime(0),
    type: 'CHAT',
  }]);

  return group;
}

module.exports = {
  getPageInfo,
  formWhere,
  getDirectChats,
  searchMessages,
  directMessage,
};
