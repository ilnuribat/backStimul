const { Group } = require('../models');

module.exports = {
  Query: {
    groups: () => Group.find(),
    group: (parent, { id }) => Group.findOne({ _id: id }),
  },
  Mutation: {
    createGroup: (parent, { group }) => Group.create(group),
    updateGroup: async (parent, { id, group }) => {
      const foundGroup = await Group.findById(id);

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
