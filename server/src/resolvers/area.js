const { ERROR_CODES } = require('../services/constants');
const { Group } = require('../models');
const objectService = require('../services/object');
const addressService = require('../services/address');

module.exports = {
  Area: {
    id: parent => parent.id || parent._id.toString(),
    objects(parent) {
      return Group.find({
        type: 'OBJECT',
        areaId: parent._id,
      });
    },
  },
  AreaMutation: {
    async create(parent, args) {
      const { area } = args;

      if (!area.address) {
        throw new Error('cant create area without address');
      }

      // провалидировать адрес, вытащить цепочку родителей
      const formedAddress = await addressService.formAddress(area.address);

      return Group.create({
        name: area.name,
        type: 'AREA',
        address: formedAddress,
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
