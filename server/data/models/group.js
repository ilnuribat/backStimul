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
