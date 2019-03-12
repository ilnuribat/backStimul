const { withFilter } = require('apollo-server');
const { Group } = require('../models');
const areaService = require('../services/area');
const addressService = require('../services/address');
const {
  ERROR_CODES, pubsub, AREA_CREATED, AREA_UPDATED, AREA_DELETED,
} = require('../services/constants');

module.exports = {
  Area: {
    id: parent => parent._id.toString(),
    objects(parent) {
      return Group.find({
        type: 'OBJECT',
        areaId: parent._id,
      }).lean();
    },
    crumbs: parent => parent.address.parentChain.map(c => ({
      id: c.fiasId,
      name: c.name,
    })),
    parent: parent => ({
      id: parent.address.parentChain.slice(-1)[0].fiasId,
      type: 'AddressObject',
    }),
    object(parent, args) {
      return Group.findOne({
        _id: args.id,
        type: 'OBJECT',
        areaId: parent._id,
      }).lean();
    },
  },
  RootObject: {
    parent: (parent) => {
      if (parent.parentId === undefined) {
        return null;
      }

      return {
        id: parent.parentId,
        type: 'AddressObject',
      };
    },
  },
  AreaMutation: {
    async create(parent, args) {
      const { area } = args;

      // провалидировать адрес, вытащить цепочку родителей
      const formedAddress = await addressService.formAddress(area.address.value);

      const areaCreated = await Group.create({
        name: area.name,
        SU: area.SU,
        type: 'AREA',
        address: {
          center: area.address.center,
          northEast: area.address.northEast,
          southWest: area.address.southWest,
          ...formedAddress,
        },
      });

      pubsub.publish(AREA_CREATED, {
        areaCreated,
      });

      return areaCreated;
    },
    async update({ _id }, { area }) {
      if (!_id) {
        throw new Error('id is required for update');
      }

      const res = await Group.updateOne({
        _id,
      }, {
        $set: {
          name: area.name,
        },
      });

      if (res.nModified) {
        const updatedArea = await Group.findById(_id);

        pubsub.publish(AREA_UPDATED, {
          areaUpdated: updatedArea,
        });
      }

      return res.nModified;
    },
    async delete(parent) {
      const res = await Group.deleteOne({ _id: parent._id });

      if (res.n) {
        pubsub.publish(AREA_DELETED, {
          areaDeleted: parent,
        });
      }

      return res.n;
    },
  },
  Query: {
    area(parent, { id }, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return Group.findById(id).lean();
    },
    areas(parent, args, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return Group.find({ type: 'AREA' });
    },
    rootObject(parent, args, ctx) {
      return areaService.rootObjectQuery(parent, args, ctx);
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
  Subscription: {
    areaCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([AREA_CREATED]),
        () => true,
      ),
    },
    areaUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([AREA_UPDATED]),
        () => true,
      ),
    },
    areaDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([AREA_DELETED]),
        () => true,
      ),
    },
  },
};
