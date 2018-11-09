const { Schema } = require('mongoose');
const { GROUP_TYPES, ADDRESS_LEVELS } = require('../services/constants');

const addressLevelSchema = new Schema({
  name: String, // Каран-Кункас
  fiasId: String,
  type: String, // с
  full: String, // с Каран-Кункас
});

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
  geoLat: String, // deprecated
  geoLon: String, // deprecated
  coordinates: [String],
  parentChain: [parentChainItem],
};

// ['region', 'area', 'city', 'settlement', 'street', 'house']
ADDRESS_LEVELS.forEach((level) => {
  addressDefinition[level] = addressLevelSchema;
});

const addressSchema = new Schema(addressDefinition);

const schema = new Schema({
  name: String,
  code: String,
  lastMessageAt: Date,
  status: Number,
  assignedTo: Schema.Types.ObjectId,
  endDate: Date,
  address: addressSchema,
  objectId: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: GROUP_TYPES,
  },
});


schema.virtual('id').get(function () {
  return this._id.toString();
});

schema.index({ code: 1 }, {
  unique: true,
  partialFilterExpression: {
    code: {
      $exists: true,
    },
  },
});

schema.static('getGroupedLevel', async function (level = 0, parentId = null) {
  const res = await this.aggregate([{
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
    },
  }, {
    $project: {
      id: '$_id',
      name: 1,
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

module.exports = schema;
