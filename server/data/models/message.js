const { Schema } = require('mongoose');

const schema = new Schema({
  userId: Schema.Types.ObjectId, // from user
  groupId: Schema.Types.ObjectId, // to group
  text: String,
  createdAt_: {
    type: Date,
    default: () => new Date(),
  },
});

schema.virtual('createdAt').get(function () {
  return this.createdAt_.toString();
});

module.exports = schema;
