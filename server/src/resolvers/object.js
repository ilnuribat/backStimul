const { Group } = require('../models');

module.exports = {
  Query: {
    async rootObject(parent, { id: addressId }) {
      const rootObject = await Group.getFiasIdLevel(addressId);
      const addresses = await Group.getGroupedLevel(rootObject.level + 1, rootObject.id);

      return {
        ...rootObject,
        addresses,
      };
    },
    async object() {
      return {
        id: 1,
        name: 'object test',
      };
    },
  },
  Mutation: {
    async createObject(parent, { object }) {
      if (object.address) {
        // провалидировать адрес, вытащить цепочку родителей
      }
      const res = await Group.create(Object.assign(object, {
        type: 'OBJECT',
      }));

      return res;
    },
  },
};
