const { Group, Message, User } = require('../models');
const { getDirectChats } = require('../services/chat');
const groupService = require('../services/group');
const { directMessage } = require('../services/chat');


module.exports = {
  Direct: {
    async lastMessage({ id }) {
      return Message.findOne({ groupId: id }).sort({ _id: -1 });
    },
    name: async (direct, args, ctx) => {
      if (direct.code && direct.code.indexOf('|') === -1) {
        return direct.name;
      }

      const anotherUserId = direct.code.split('|').filter(dId => dId !== ctx.user.id);
      const anotherUser = await User.findById(anotherUserId);

      return anotherUser.email;
    },
    users: groupService.getMembers,
    unreadCount: groupService.unreadCount,
    messages: groupService.getMessages,
  },
  Query: {
    directs: async (parent, args, { user }) => {
      if (!user) {
        throw new Error('not authorized');
      }

      return getDirectChats(user);
    },
    direct: async (parent, { id }) => Group.findOne({
      _id: id,
      code: {
        $exists: true,
      },
    }),
  },
  Mutation: {
    directMessage,
  },
};
