const { ERROR_CODES } = require('../services/constants');
const { Group } = require('../models');
const areaService = require('../services/area');
const addressService = require('../services/address');

module.exports = {
  Area: {
    id: parent => parent._id.toString(),
    objects(parent) {
      return Group.find({
        type: 'OBJECT',
        areaId: parent._id,
      });
    },
    crumbs: parent => parent.address.parentChain.map(c => ({
      id: c.fiasId,
      name: c.name,
    })),
    parent: parent => ({
      id: parent.address.parentChain.slice(-1)[0].fiasId,
      type: 'ADDRESS',
    }),
    object(parent, args) {
      return Group.findOne({
        _id: args.id,
        type: 'OBJECT',
        areaId: parent._id,
      });
    },
  },
  RootObject: {
    parent: (parent) => {
      if (!parent.parentId) {
        return null;
      }

      return {
        id: parent.parentId,
        type: 'ADDRESS',
      };
    },
  },
  AreaMutation: {
    async create(parent, args) {
      const { area } = args;

      // провалидировать адрес, вытащить цепочку родителей
      const formedAddress = await addressService.formAddress(area.address.value);

      return Group.create({
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
    },
    async update({ id }, { area }) {
      if (!id) {
        throw new Error('id is required for update');
      }

      const res = await Group.updateOne({
        _id: id,
      }, {
        $set: {
          name: area.name,
        },
      });

      return res.nModified;
    },
    async delete({ id }) {
      const res = await Group.deleteOne({ _id: id });

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
};
