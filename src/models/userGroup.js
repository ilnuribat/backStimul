const { Schema, Types } = require('mongoose');

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  lastReadCursor: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId.createFromTime(0),
  },
  type: {
    type: String,
    enum: ['CHAT', 'APPROVER'],
    required: true,
  },
  comment: String,
  approveDecision: {
    type: String,
    enum: ['APPROVED', 'DECLINED', 'NONE'],
  },
});

module.exports = schema;
