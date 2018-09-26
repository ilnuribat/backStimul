const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');

module.exports = {
  Group: {
    async users(parent) {
      const { id } = parent;
      const usersGroup = await UserGroup.find({ groupId: id });
      const users = await User.find({ _id: { $in: usersGroup.map(u => u.userId) } });

      return users;
    },
    async messages(parent) {
      const { id } = parent;

      return Message.find({ groupId: id });
    },
  },
  Query: {
    groups: () => Group.find(),
    group: (parent, { id }) => Group.findOne({ _id: id }),
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
    },
    updateGroup: async (parent, { id, group }) => {
      const groupId = id || group.id;
      const foundGroup = await Group.findById(groupId);

      if (!foundGroup) {
        return false;
      }

      const res = await foundGroup.update(group);

      return res.nModified;
    },
    deleteGroup: async (parent, { id }) => {
      const res = await Group.deleteOne({ _id: id });

      return res.n;
    },
    joinGroup: async (parent, { id }, { user }) => {
      const group = await Group.findById(id);

      if (!group) {
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
  },
};
