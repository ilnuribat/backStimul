const { Types: { ObjectId } } = require('mongoose');
const {
  Group, Message, User, UserGroup,
} = require('../models');
const GroupResolver = require('./group');
const {
  getPageInfo, formWhere, getDirectChats,
} = require('../services/chat');


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
  Mutation: {
    directMessage: async (parent, { id }, { user }) => {
      const dUser = await User.findById(id);

      if (!dUser) {
        throw new Error('no user found with such id');
      }
      const ids = [user.id, dUser.id].sort();

      // try to create such group
      let group;

      try {
        group = await Group.create({
          name: ids.join(', '),
          code: ids.join('|'),
        });
      } catch (err) {
        if (err.errmsg && err.errmsg.indexOf('duplicate key error') > -1) {
          group = await Group.findOne({ code: ids.join('|') });
        }
      }

      try {
        await UserGroup.insertMany([{
          userId: user.id,
          groupId: group.id,
          lastReadCursor: ObjectId.createFromTime(0),
        }, {
          userId: dUser.id,
          groupId: group.id,
          lastReadCursor: ObjectId.createFromTime(0),
        }]);
      } catch (err) {
        if (err.errmsg && err.errmsg.indexOf('duplicate key error')) {
          return group;
        }

        throw err;
      }

      return group;
    },
  },
};
