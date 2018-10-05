const { PubSub, withFilter } = require('apollo-server');
const moment = require('moment');
const {
  Message, User, Group, UserGroup,
} = require('../models');

const pubsub = new PubSub();
const MESSAGED_ADDED = 'MESSAGED_ADDED';
const MESSAGE_READ = 'MESSAGE_READ';

module.exports = {
  Message: {
    from(parent) {
      const { userId } = parent;

      return User.findById(userId);
    },
    to(parent) {
      const { groupId } = parent;

      return Group.findById(groupId);
    },
    createdAt: message => moment(message.createdAt).format(),
    userId: message => message.userId.toString(),
    isRead: async (message, args, ctx) => {
      const { user } = ctx;

      if (message.isRead !== undefined) {
        return message.isRead;
      }
      if (message.userId.toString() !== user.id) {
        return true;
      }

      const userGroups = await UserGroup.find({
        userId: {
          $ne: user.id,
        },
        groupId: message.groupId,
      }).sort({ _id: 1 });

      const unReadMessages = userGroups.filter(ug => ug.lastReadCursor < message.id);

      return unReadMessages.length === 0;
    },
  },
  Query: {
    messages: (parent, { groupId }) => Message.find({ groupId }),
    message: (parent, { id }) => Message.findById(id),
  },
  Mutation: {
    async createMessage(parent, { message }, { user }) {
      if (!user) {
        throw new Error(401);
      }

      const userGroup = await UserGroup.findOne({
        userId: user.id,
        groupId: message.groupId,
      });

      if (!userGroup) {
        throw new Error('forbidden');
      }


      const createdMessage = await Message.create({
        userId: user.id,
        ...message,
      });

      await UserGroup.update({
        userId: user.id,
        groupId: message.groupId,
      }, {
        $set: {
          lastReadCursor: createdMessage._id,
        },
      });

      pubsub.publish(MESSAGED_ADDED, { messageAdded: createdMessage });

      return createdMessage;
    },
    async messageRead(parent, { id }, { user }) {
      if (!user) {
        throw new Error('not authenticated');
      }
      const message = await Message.findById(id);

      if (!message) {
        throw new Error('no message found');
      }

      // Вытащить последний чужой курсор.
      const lastAnotherReadCursor = await UserGroup.findOne({
        groupId: message.groupId,
        userId: {
          $ne: user.id,
        },
      }).sort({ _id: 1 });
      const myOldCursor = await UserGroup.findOne({
        groupId: message.groupId,
        userId: user.id,
      });

      const userGroup = await UserGroup.updateOne({
        userId: user.id,
        groupId: message.groupId,
      }, {
        $set: {
          lastReadCursor: message.id,
        },
      });

      // диалог с самим собой, просто выходим
      if (!lastAnotherReadCursor) {
        return true;
      }

      // Если мой курсор был старее всех остальных
      // значит все сообщения в этом отрезке должны быть прочитаны.
      if (myOldCursor.lastReadCursor < lastAnotherReadCursor.lastReadCursor) {
        const endCursor = lastAnotherReadCursor.lastAnotherReadCursor < message._id
          ? lastAnotherReadCursor.lastReadCursor
          : message._id;
        const messages = await Message.find({
          _id: {
            $gt: myOldCursor.lastReadCursor,
            $lte: endCursor,
          },
          groupId: message.groupId,
          userId: { $ne: user.id },
        });

        messages.map(m => pubsub.publish(MESSAGE_READ, { messageRead: { isRead: true, id: m._id.toString() } }));
      }

      return userGroup.nModified;

      // return false;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGED_ADDED]),
        ({ messageAdded: { groupId: mGroupId } }, { groupId }) => mGroupId.toString() === groupId,
      ),
    },
    messageRead: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_READ]),
        ({ messageRead: { id: mId } }, { id }) => mId === id,
      ),
    },
  },
};
