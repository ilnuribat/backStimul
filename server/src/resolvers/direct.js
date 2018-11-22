const { Group, Message, User } = require('../models');
const {
  getPageInfo, formWhere, getDirectChats,
} = require('../services/chat');
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
    messages: async (parent, { messageConnection }) => {
      const { id } = parent;
      const group = await Group.findById(id);

      if (!group /* || group.code */) {
        throw new Error('no group found');
      }
      const {
        first, last, before, after,
      } = messageConnection || {};
      // before - last, after - first

      const where = formWhere({ id, before, after });

      const messages = await Message.find(where).limit(first || last);

      const pageInfo = await getPageInfo({
        messages, groupId: id, before, after,
      });

      return {
        pageInfo,
        edges: messages.map(m => ({
          node: m,
          cursor: m.id,
        })),
      };
    },
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
