const { Group, UserGroup } = require('../models');

module.exports = {
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
  },
};
