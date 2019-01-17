const { Schema } = require('mongoose');
const { GROUP_TYPES } = require('../services/constants');

const { ObjectId } = Schema.Types;


const parentChainItem = new Schema({
  fiasId: String,
  type: String,
  parentId: String,
  name: String,
});

const addressDefinition = {
  value: String,
  fiasId: String,
  fiasLevel: String,
  center: [String],
  northEast: [String],
  southWest: [String],
  parentChain: [parentChainItem],
};

const addressSchema = new Schema(addressDefinition);

const schema = new Schema({
  name: String,
  code: String,
  lastMessageAt: Date,
  status: Number,
  assignedTo: ObjectId,
  endDate: Date,
  address: addressSchema,
  objectId: ObjectId,
  areaId: ObjectId,
  type: {
    type: String,
    enum: GROUP_TYPES,
  },
  parentId: ObjectId,
});


schema.virtual('id').get(function () {
  return this._id.toString();
});

schema.static('getGroupedLevel', async function (level = 0, parentId = null) {
  const res = await this.aggregate([{
    $match: {
      type: 'AREA',
    },
  }, {
    $project: {
      chain: {
        $arrayElemAt: ['$address.parentChain', level],
      },
    },
  }, {
    $match: {
      'chain.parentId': parentId,
    },
  }, {
    $group: {
      _id: '$chain.fiasId',
      name: {
        $first: '$chain.name',
      },
      type: {
        $first: '$chain.type',
      },
    },
  }, {
    $project: {
      id: '$_id',
      name: {
        $concat: ['$type', '. ', '$name'],
      },
    },
  }]);

  return res.filter(a => a._id);
});

schema.static('getFiasIdLevel', async function (fiasId) {
  const [res] = await this.aggregate([{
    $unwind: {
      path: '$address.parentChain',
      includeArrayIndex: 'index',
    },
  }, {
    $match: {
      'address.parentChain.fiasId': fiasId,
    },
  }, {
    $group: {
      _id: '$address.parentChain.parentId',
      level: {
        $first: '$index',
      },
      name: {
        $first: '$address.parentChain.name',
      },
      type: {
        $first: '$address.parentChain.type',
      },
      parentId: {
        $first: '$address.parentChain.parentId',
      },
      id: {
        $first: '$address.parentChain.fiasId',
      },
    },
  }]);

  return res;
});

schema.static('getParentChain', async function (fiasId, level) {
  const res = await this.findOne({
    [`address.parentChain.${level}.fiasId`]: {
      $eq: fiasId,
    },
  }).lean();

  const chain = res.address.parentChain
    .slice(0, level)
    .map(pc => ({
      id: pc.fiasId,
      name: pc.name,
    }));

  chain.unshift({
    id: null,
    name: 'Россия',
  });

  return chain;
});

module.exports = schema;
