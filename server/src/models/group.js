const { Schema } = require('mongoose');

const schema = new Schema({
  name: String,
  code: {
    type: String,
    // unique: true,
  },
  lastMessageAt: Date,
  status: Number,
  assignedTo: Schema.Types.ObjectId,
  endDate: Date,
  address: {
    value: String,
    fias_id: String,
    fias_level: String,
    geoLat: String,
    geoLon: String,
    coordinates: [String],
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
