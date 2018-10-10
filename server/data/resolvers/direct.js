const { withFilter } = require('apollo-server');
const {
  Group, Message, User,
} = require('../models');
const GroupResolver = require('./group');
const {
  getPageInfo, formWhere, getDirectChats, pubsub, MESSAGED_ADDED,
} = require('./chat');


module.exports = {
  Direct: {
    name: async (direct, args, ctx) => {
      if (direct.code && direct.code.indexOf('|') === -1) {
        return direct.name;
      }

      const anotherUserId = direct.code.split('|').filter(dId => dId !== ctx.user.id);
      const anotherUser = await User.findById(anotherUserId);

      return anotherUser.email;
    },
    users: parent => GroupResolver.Group.users(parent),
    unreadCount: (parent, args, ctx) => GroupResolver.Group.unreadCount(parent, args, ctx),
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
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGED_ADDED]),
        ({ messageAdded: { groupId: mGroupId } }, { groupId }) => mGroupId.toString() === groupId,
      ),
    },
  },
};
