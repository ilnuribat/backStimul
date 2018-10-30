const { Schema } = require('mongoose');
const { GROUP_TYPES, ADDRESS_LEVELS } = require('../resolvers/chat');

// 'region', 'area', 'city', 'settlement', 'street', 'house'
const [
  regionSchema,
  areaSchema,
  citySchema,
  settlementSchema,
  streetSchema,
  houseSchema,
] = ADDRESS_LEVELS.map(() => new Schema({
  name: String,
  fias_id: String,
  type: String,
  full: String,
}));

const parentChainItem = new Schema({
  fias_id: String,
  type: String,
});

const addressSchema = new Schema({
  value: String,
  fias_id: String,
  fias_level: String,
  geoLat: String,
  geoLon: String,
  coordinates: [String],
  region: regionSchema,
  area: areaSchema,
  city: citySchema,
  settlement: settlementSchema,
  street: streetSchema,
  house: houseSchema,
  parentChain: [parentChainItem],
});

const schema = new Schema({
  name: String,
  code: String,
  lastMessageAt: Date,
  status: Number,
  assignedTo: Schema.Types.ObjectId,
  endDate: Date,
  address: addressSchema,
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

module.exports = schema;
