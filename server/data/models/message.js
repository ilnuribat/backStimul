const { Schema } = require('mongoose');

const schema = new Schema({
  userId: Schema.Types.ObjectId, // from user
  groupId: Schema.Types.ObjectId, // to group
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = schema;
