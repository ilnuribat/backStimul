const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');
const { getPageInfo, formWhere } = require('./chat');

module.exports = {
  Group: {
    async users(parent) {
      const { id } = parent;
      const usersGroup = await UserGroup.find({ groupId: id });
      const users = await User.find({ _id: { $in: usersGroup.map(u => u.userId) } });

      return users;
    },
    async messages(parent, args) {
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
    groups: () => Group.find({ code: null }),
    group: (parent, { id }) => Group.findOne({ _id: id, code: null }),
  },
  Mutation: {
    createGroup: async (parent, { group }, { user }) => {
      const created = await Group.create(group);

      await UserGroup.create({
        userId: user.id,
        groupId: created.id,
      });

      const { userIds } = group;

      if (Array.isArray(userIds) && userIds.length) {
        await UserGroup.insertMany(userIds.map(u => ({
          userId: u,
          groupId: created.id,
        })));
      }

      return created;
    },
    updateGroup: async (parent, { id, group }) => {
      const groupId = id || group.id;
      const foundGroup = await Group.findById(groupId);

      if (!foundGroup) {
        return false;
      }

      const res = await foundGroup.update(group);

      const { userIds } = group;

      if (Array.isArray(userIds) && userIds.length) {
        await UserGroup.insertMany(userIds.map(u => ({
          userId: u,
          groupId: foundGroup.id,
        })));
      }

      return res.nModified;
    },
    deleteGroup: async (parent, { id }) => {
      const res = await Group.deleteOne({ _id: id });

      return res.n;
    },
    updateUsersGroup: async (parent, { group }) => {
      const groupId = group.id;
      const foundGroup = await Group.findById(groupId);

      if (!foundGroup) {
        return false;
      }

      const { users } = group;

      if (!group.delete) {
        if (Array.isArray(users) && users.length) {
          await UserGroup.insertMany(users.map(u => ({
            userId: u,
            groupId: foundGroup.id,
          })));
        } else if (Array.isArray(users) && users.length) {
          await UserGroup.deleteMany(users.map(u => ({
            userId: u,
            groupId: foundGroup.id,
          })));
        }

        return true;
      }

      return false;
    },
    joinGroup: async (parent, { id }, { user }) => {
      const group = await Group.findById(id);

      if (!group || group.code) {
        return false;
      }

      try {
        await UserGroup.create({ userId: user.id, groupId: id });

        return true;
      } catch (err) {
        if (err.errmsg.indexOf('duplicate key error') > -1) {
          return false;
        }

        throw err;
      }
    },
    leaveGroup: async (parent, { id }, { user }) => {
      const res = await UserGroup.deleteOne({ userId: user.id, groupId: id });

      return res.n;
    },
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
        }, {
          userId: dUser.id,
          groupId: group.id,
        }]);
      } catch (err) {
        if (err.errmsg && err.errmsg.indexOf('duplicate key error')) {
          return group;
        }
      }

      return group;
    },
  },
};
