const moment = require('moment');
const { Types: { ObjectId } } = require('mongoose');
const {
  Message, UserGroup, Group,
} = require('../models');
const {
  MESSAGE_ADDED,
  MESSAGE_READ,
  pubsub,
  ERROR_CODES,
} = require('./constants');
const taskService = require('./task');


async function createMessage(parent, { message }, { user }) {
  if (!user) {
    throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
  }

  const group = await Group.findById(message.groupId).lean();

  if (!group) {
    throw new Error(ERROR_CODES.NOT_FOUND);
  }

  const userGroup = await UserGroup.findOne({
    userId: user._id,
    groupId: message.groupId,
    type: 'CHAT',
  });

  if (group.type === 'TASK' && !userGroup) {
    // invite user to task
    await taskService.inviteUserToGroup({ group, user });
  }

  if (group.type === 'DIRECT' && !userGroup) {
    throw new Error(ERROR_CODES.FORBIDDEN);
  }

  const isDirect = !!group.code;
  const objectId = isDirect ? null : group.objectId;

  const createdMessage = await Message.create({
    userId: user.id,
    isDirect,
    objectId,
    ...message,
  });

  await UserGroup.updateOne({
    userId: user._id,
    groupId: message.groupId,
    type: 'CHAT',
  }, {
    $set: {
      lastReadCursor: createdMessage._id,
    },
  });

  await Group.updateOne({
    _id: message.groupId,
  }, {
    $set: {
      lastMessageAt: moment(),
    },
  });

  pubsub.publish(MESSAGE_ADDED, { messageAdded: createdMessage });

  return createdMessage;
}

async function messageRead(parent = {}, args, { user }) {
  const id = parent.id || args.id;

  if (!user) {
    throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
  }
  const message = await Message.findById(id);

  if (!message) {
    throw new Error('no message found');
  }

  // Вытащить последний чужой курсор.
  const lastAnotherReadCursor = await UserGroup.findOne({
    groupId: ObjectId(message.groupId),
    userId: {
      $ne: ObjectId(user.id),
    },
    type: 'CHAT',
  }).sort({ _id: 1 });
  // вытащить свой курсор
  const myOldCursor = await UserGroup.findOne({
    groupId: ObjectId(message.groupId),
    userId: ObjectId(user.id),
    type: 'CHAT',
  });

  const userGroup = await UserGroup.updateOne({
    userId: ObjectId(user.id),
    groupId: ObjectId(message.groupId),
    type: 'CHAT',
  }, {
    $set: {
      lastReadCursor: ObjectId(message.id),
    },
  });

  // диалог с самим собой, просто выходим
  if (!lastAnotherReadCursor) {
    return true;
  }

  // Если мой курсор был старее всех остальных
  // значит все сообщения в этом отрезке должны быть прочитаны.
  if (myOldCursor.lastReadCursor < lastAnotherReadCursor.lastReadCursor) {
    // важно понимать, что endCursor может быть и меньше чем lastAnotherCursor
    // например, зашли в чат и увидели только начало непрочитанных сообщений.
    // тогда отрезок прочитанных сообщений будет от myOldCursor до message._id
    const endCursor = lastAnotherReadCursor.lastReadCursor < message._id
      ? lastAnotherReadCursor.lastReadCursor
      : message._id;
    const messages = await Message.find({
      _id: {
        $gt: ObjectId(myOldCursor.lastReadCursor),
        $lte: ObjectId(endCursor),
      },
      groupId: ObjectId(message.groupId),
      userId: { $ne: ObjectId(user.id) },
    }).lean();

    messages.forEach((m) => {
      pubsub.publish(MESSAGE_READ, { messageRead: { isRead: true, ...m } });
    });
  }

  return userGroup.nModified;
}

module.exports = {
  createMessage,
  messageRead,
};
