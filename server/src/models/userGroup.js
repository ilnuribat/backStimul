const { Schema, Types } = require('mongoose');

const schema = new Schema({
  userId: Schema.Types.ObjectId,
  groupId: Schema.Types.ObjectId,
  lastReadCursor: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId.createFromTime(0),
  },
});

schema.index({ userId: 1, groupId: 1 }, { unique: true });

module.exports = schema;
