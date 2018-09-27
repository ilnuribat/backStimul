const { Message, User, Group } = require('../models');

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
    createMessage(parent, args, { user }) {
      if (!user) {
        throw new Error(401);
      }

      return Message.create({
        userId: user.id,
        ...args.message,
      });
    },
  },
};
