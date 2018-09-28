const { Schema } = require('mongoose');

const schema = new Schema({
  name: String,
  code: {
    type: String,
    // unique: true,
  }
});

schema.virtual('id').get(function () {
  return this._id.toString();
});

schema.index({ code: 1 }, { unique: true });

module.exports = schema;
