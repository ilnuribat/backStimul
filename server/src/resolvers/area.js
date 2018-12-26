const { ERROR_CODES } = require('../services/constants');
const { Group } = require('../models');
const objectService = require('../services/object');

module.exports = {
  Area: {
    id: parent => parent.id || parent._id.toString(),
    objects(parent) {
      return Group.find({
        areaId: parent.id,
      });
    },
  },
  Query: {
    area(parent, { id }, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return Group.findById(id).lean();
    },
    rootObject(parent, args, ctx) {
      return objectService.rootObjectQuery(parent, args, ctx);
    },
  },
  Mutation: {
    area(parent, { id }, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      if (id) {
        return Group.findById(id);
      }

      return {};
    },
  },
};
