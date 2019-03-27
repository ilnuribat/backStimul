const { getDirectChats } = require('../services/chat');
const groupService = require('../services/group');
const { directMessage } = require('../services/chat');
const { ERROR_CODES } = require('../services/constants');
const {
  Group,
  Message,
  User,
  UserGroup,
} = require('../models');


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

      if (!anotherUser) {
        return ctx.user.email;
      }

      return anotherUser.email;
    },
    users: groupService.getMembers,
    user: async (parent, args, { user }) => {
      const ug = await UserGroup.findOne({
        groupId: parent._id,
        userId: {
          $ne: user._id,
        },
        type: 'CHAT',
      });

      if (!ug) {
        throw new Error('no way to chat with yourselves');
      }

      return User.findById(ug.userId);
    },
    unreadCount: groupService.unreadCount,
    messages: groupService.getMessages,
  },
  Query: {
    directs: async (parent, args, { user }) => {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return getDirectChats(user);
    },
    direct: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      const userGroup = await UserGroup.findOne({
        groupId: id,
        userId: user._id,
        type: 'CHAT',
      });

      if (!userGroup) {
        throw new Error(ERROR_CODES.FORBIDDEN);
      }

      return Group.findOne({
        _id: id,
        type: 'DIRECT',
      });
    },
  },
  Mutation: {
    directMessage,
  },
};
