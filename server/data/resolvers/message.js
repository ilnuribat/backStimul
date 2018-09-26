const { Message } = require('../models');

module.exports = {
  Message: {
    from() {

    },
    to() {

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
