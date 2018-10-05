const {
  Group, UserGroup, Message, User,
} = require('../models');
const GroupResolver = require('./group');
const { getPageInfo, formWhere } = require('./chat');

module.exports = {
  Direct: {
    name: async (direct, args, ctx) => {
      const anotherUserId = direct.code.split('|').filter(dId => dId !== ctx.user.id);
      const anotherUser = await User.findById(anotherUserId);

      return anotherUser.email;
    },
    users: parent => GroupResolver.Group.users(parent),
    messages: async (parent, args) => {
      const { id } = parent;
      const group = await Group.findById(id);

      if (!group /* || group.code */) {
        throw new Error('no group found');
      }
      const {
        first, last, before, after,
      } = args;
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
    directs: async (parent, args, ctx) => {
      const { user } = ctx;

      if (!user) {
        throw new Error('not authorized');
      }
      const userGroups = await UserGroup.find({ userId: user.id });
      const directs = await Group.find({
        code: { $exists: true },
        _id: {
          $in: userGroups.map(ug => ug.groupId),
        },
      });

      return directs;
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
