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

      if (!userGroup) { throw new Error('forbidden'); }

      const createdMessage = await Message.create({
        userId: user.id,
        ...message,
      });

      pubsub.publish(MESSAGED_ADDED, { messageAdded: createdMessage });

      return createdMessage;
    },
    async message(parent, { message }, { user }) {
      if (!user) {
        throw new Error(401);
      }

      const userGroup = await UserGroup.findOne({
        userId: user.id,
        groupId: message.groupId,
      });

      if (!userGroup) { throw new Error('forbidden'); }

      const message = await Message.create({
        userId: user.id,
        ...message,
      });

      pubsub.publish('MESSAGE_READ', { message: message });

      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGED_ADDED]),
        ({ messageAdded: { groupId: mGroupId } }, { groupId }) => mGroupId.toString() === groupId,
      ),
    },
    message: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MESSAGE_READ']),
        ({ message: { id: mid } }, { id }) => mid.toString() === id,
      ),
    },
  },
};
