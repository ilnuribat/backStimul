const { Group, UserGroup } = require('../models');
const objectService = require('../services/object');
const { ERROR_CODES, constructionTypeMap } = require('../services/constants');

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
      return parent.areaId.toString();
    },
    parent(parent) {
      return {
        id: parent.areaId.toString(),
        type: 'AREA',
      };
    },
    constructionType: parent => constructionTypeMap[parent.constructionTypeId],
  },
  ObjectMutations: {
    create: objectService.createObject,
    update: objectService.updateObject,
  },
  Query: {
    async object(parent, { id }) {
      return Group.findById(id).lean();
    },
    objects() {
      return Group.find({ type: 'OBJECT' }).lean();
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
    async updateObject(parent, args, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }
      const foundObject = await Group.findOne({
        type: 'OBJECT',
        _id: args.id,
      });

      return objectService.updateObject(foundObject, args);
    },
    deleteObject: objectService.deleteObject,
  },
};
