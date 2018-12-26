const { Group, UserGroup } = require('../models');
const objectService = require('../services/object');
const { ERROR_CODES } = require('../services/constants');

module.exports = {
  Object: {
    id: object => object._id.toString(),
    async tasks(parent, args, { user }) {
      const userGroups = await UserGroup.find({
        userId: user.id,
      });

      return Group.find({
        objectId: parent.id,
        code: null,
        _id: {
          $in: userGroups.map(ug => ug.groupId),
        },
      });
    },
    parentId(parent) {
      const { address } = parent;

      if (address) {
        const { length } = address.parentChain;

        return address.parentChain[length - 1].fiasId;
      }

      return null;
    },
  },
  ObjectMutations: {
    create: objectService.createObject,
    update: objectService.updateObject,
  },
  Query: {
    async object(parent, { id }) {
      return Group.findById(id);
    },
    objects() {
      return Group.find({ type: 'OBJECT' });
    },
  },
  Mutation: {
    object(parent, { id }, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }
      if (id) {
        return Group.findById(id);
      }

      return {};
    },
    createObject: objectService.createObject,
    updateObject: objectService.updateObject,
    deleteObject: objectService.deleteObject,
  },
};
