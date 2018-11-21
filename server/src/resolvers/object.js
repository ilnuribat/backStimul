const { Group, UserGroup } = require('../models');
const obejctService = require('../services/object');
const addressService = require('../services/address');

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
  Query: {
    rootObject(parent, args, ctx) {
      return obejctService.rootObjectQuery(parent, args, ctx);
    },
    async object(parent, { id }) {
      return Group.findById(id);
    },
    objects() {
      return Group.find({ type: 'OBJECT' });
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
    async updateObject(parent, { id, object }) {
      const objectId = id || object.id;
      const foundObject = await Group.findOne({ _id: objectId, type: 'OBJECT' });

      if (!foundObject) {
        throw new Error('no object found');
      }

      if (object.address && object.address !== foundObject.address.value) {
        const formedAddress = await addressService.formAddress(object.address);

        Object.assign(object, { address: formedAddress });
      } else {
        Object.assign(object, { address: foundObject.address });
      }

      const res = await Group.updateOne({
        _id: id,
      }, {
        $set: object,
      });

      return res.nModified;
    },
    async deleteObject(parent, { id }) {
      const res = await Group.deleteOne({ _id: id });

      return res.n;
    },
  },
};
