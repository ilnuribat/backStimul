const { Schema } = require('mongoose');

const schema = new Schema({
  userId: Schema.Types.ObjectId, // from user
  groupId: Schema.Types.ObjectId, // to group
  text: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  isDirect: Boolean,
  objectId: Schema.Types.ObjectId,
});

module.exports = schema;
