const { Schema } = require('mongoose');

const schema = new Schema({
  name: String,
});

schema.virtual('id').get(function () {
  return this._id.toString();
});

module.exports = schema;
