const { withFilter } = require('apollo-server');
const moment = require('moment');
const {
  Message, User, Group, UserGroup,
} = require('../models');
const { MESSAGE_READ, pubsub, MESSAGED_ADDED } = require('./chat');


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
    groupId: message => message.groupId.toString(),
    isRead: async (message) => {
      if (message.isRead !== undefined) {
        return message.isRead;
      }

      const userGroups = await UserGroup.find({
        userId: {
          $ne: message.userId,
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

      await UserGroup.updateOne({
        userId: user.id,
        groupId: message.groupId,
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
        const endCursor = lastAnotherReadCursor.lastReadCursor < message._id
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
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGED_ADDED]),
        async ({ messageAdded: { groupId: mGroupId } }, { groupId }, ctx) => {
          console.log('this is only group');
          if (groupId) {
            return mGroupId.toString() === groupId;
          }

          const userGroup = await UserGroup.findOne({
            groupId: mGroupId,
            userId: ctx.user.id,
          });

          if (userGroup) {
            return true;
          }

          return false;
        },
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
