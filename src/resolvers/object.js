const { withFilter } = require('apollo-server');
const { Group } = require('../models');
const objectService = require('../services/object');
const {
  ERROR_CODES,
  OBJECTS_TABS_NAMES,
  pubsub,
  OBJECT_CREATED,
  OBJECT_DELETED,
  OBJECT_UPDATED,
} = require('../services/constants');
const sakuraObjectsTypes = require('../services/assets/sakuraObjectTypes.json');

module.exports = {
  Object: {
    id: object => object._id.toString(),
    async tasks(parent, { tab }) {
      const where = {
        objectId: parent._id,
        type: 'TASK',
      };

      if (tab) {
        where.tab = tab;
      }

      return Group.find(where);
    },
    parentId(parent) {
      return parent.areaId.toString();
    },
    areaId(parent) {
      return parent.areaId.toString();
    },
    tabs: () => OBJECTS_TABS_NAMES,
    parent(parent) {
      return {
        id: parent.areaId.toString(),
        type: 'Area',
      };
    },
    constructionType: parent => sakuraObjectsTypes
      .find(e => e.id === Number(parent.constructionTypeId)),
  },
  ObjectMutations: {
    create: objectService.createObject,
    update: objectService.updateObject,
    delete: objectService.deleteObject,
  },
  Query: {
    async object(parent, { id }) {
      return Group.findOne({
        _id: id,
        type: 'OBJECT',
      }).lean();
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
        return Group.findOne({
          type: 'OBJECT',
          _id: id,
        });
      }

      return {};
    },
  },
  Subscription: {
    objectCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([OBJECT_CREATED]),
        () => true,
      ),
    },
    objectDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([OBJECT_DELETED]),
        () => true,
      ),
    },
    objectUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([OBJECT_UPDATED]),
        () => true,
      ),
    },
  },
};
