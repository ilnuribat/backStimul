const { PubSub, withFilter } = require('apollo-server');
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
  },
  Query: {
    messages: (parent, { groupId }) => Message.find({ groupId }),
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
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGED_ADDED]),
        ({ messageAdded: { groupId: mGroupId } }, { groupId }) => {
          console.log('should send?', mGroupId.toString() === groupId, { mGroupId, groupId });

          // 5bab4acd749d802d39565e3f
          // 5bab4acd749d802d39565e3f

          // return true;
          return mGroupId.toString() === groupId;
        },
      ),
      // (parent, args, ctx) => {
      //   console.log(parent, args, ctx);

      //   return pubsub.asyncIterator([MESSAGED_ADDED]);
      // },
    },
  },
};
