const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');
const {
  getPageInfo, formWhere,
} = require('../services/chat');

function assignedTo(parent) {
  if (!parent.assignedTo) {
    return null;
  }

  return User.findById(parent.assignedTo);
}

function lastMessage({ id }) {
  return Message.findOne({ groupId: id }).sort({ _id: -1 });
}

async function getMessages(parent, { messageConnection }, { user }) {
  const { id } = parent;
  const group = await Group.findById(id);

  if (!group /* || group.code */) {
    throw new Error('no group found');
  }
  const {
    first, last, before, after,
  } = messageConnection || {};
    // before - last, after - first
  const where = formWhere({ id, before, after });

  let messages = await Message.find(where).limit(first || last).lean();
  const oldestCursor = await UserGroup.findOne({
    groupId: id,
    userId: {
      $ne: user.id,
    },
  }).sort({ lastReadCursor: 1 });

  messages = messages.map(m => ({
    ...m,
    id: m._id.toString(),
    isRead: oldestCursor && oldestCursor.lastReadCursor >= m._id,
  }));

  const pageInfo = await getPageInfo({
    messages, groupId: id, before, after,
  });

  return {
    pageInfo,
    edges: messages.map(m => ({
      node: m,
      cursor: m.id,
    })),
  };
}

async function unreadCount({ id }, args, { user }) {
  const userGroup = await UserGroup.findOne({ groupId: id, userId: user.id });
  const { lastReadCursor } = userGroup || {};

  return Message.find({
    groupId: id,
    userId: {
      $ne: user.id,
    },
    _id: {
      $gt: lastReadCursor,
    },
  }).count();
}

async function getMembers(group) {
  const { id } = group;
  const usersGroup = await UserGroup.find({ groupId: id });
  const users = await User.find({ _id: { $in: usersGroup.map(u => u.userId) } });

  return users;
}

module.exports = {
  assignedTo,
  lastMessage,
  getMessages,
  unreadCount,
  getMembers,
};