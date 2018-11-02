const { Group } = require('../models');
const obejctService = require('../services/object');
const addressService = require('../services/address');

module.exports = {
  Object: {
    async tasks(parent) {
      return Group.find({
        objectId: parent.id,
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
  Query: {
    rootObject(parent, args, ctx) {
      return obejctService.rootObjectQuery(parent, args, ctx);
    },
    async object(parent, { id }) {
      return Group.findById(id);
    },
  },
  Mutation: {
    async createObject(parent, { object }) {
      Object.assign(object, {
        type: 'OBJECT',
      });
      if (object.address) {
        // провалидировать адрес, вытащить цепочку родителей
        const formedAddress = await addressService.formAddress(object.address);

        Object.assign(object, { address: formedAddress });
      }
      const res = await Group.create(object);

      return res;
    },
  },
};
