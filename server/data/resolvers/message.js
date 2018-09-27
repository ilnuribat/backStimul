const { PubSub } = require('apollo-server');
const { Message, User, Group } = require('../models');

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
  },
  Query: {
    messages(parent, { groupId }) {
      return Message.find({ groupId });
    },
  },
  Mutation: {
    async createMessage(parent, args, { user }) {
      if (!user) {
        throw new Error(401);
      }

      const message = await Message.create({
        userId: user.id,
        ...args.message,
      });

      pubsub.publish(MESSAGED_ADDED, { messageAdded: message });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, args, context) => {
        console.log(args, context);

        return pubsub.asyncIterator([MESSAGED_ADDED]);
      },
    },
  },
};
