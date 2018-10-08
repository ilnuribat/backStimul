const { Schema } = require('mongoose');

const schema = new Schema({
  name: String,
  code: {
    type: String,
    // unique: true,
  },
  lastMessageAt: Date,
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
