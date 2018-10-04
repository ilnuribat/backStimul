const { PubSub, withFilter } = require('apollo-server');
const moment = require('moment');
const {
  Message, User, Group, UserGroup,
} = require('../models');

const pubsub = new PubSub();
const MESSAGED_ADDED = 'MESSAGED_ADDED';

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
    isRead: async (message, args, { user }) => {
      if (message.isRead !== undefined) {
        return message.isRead;
      }
      console.log('каждый раз');
      if (message.userId.toString() !== user.id) {
        return true;
      }

      const userGroups = await UserGroup.find({
        userId: {
          $ne: user.id,
        },
        groupId: message.groupId,
        lastReadCursor: { $exists: true },
      });

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

      const userGroup = await UserGroup.updateOne({
        userId: user.id,
        groupId: message.groupId,
      }, {
        $set: {
          lastReadCursor: message.id,
        },
      });

      return userGroup.nModified;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGED_ADDED]),
        ({ messageAdded: { groupId: mGroupId } }, { groupId }) => mGroupId.toString() === groupId,
      ),
    },
  },
};
