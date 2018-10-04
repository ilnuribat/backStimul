const { Schema } = require('mongoose');

const schema = new Schema({
  userId: Schema.Types.ObjectId,
  groupId: Schema.Types.ObjectId,
  lastReadCursor: Schema.Types.ObjectId,
});

schema.index({ userId: 1, groupId: 1 }, { unique: true });

module.exports = schema;
