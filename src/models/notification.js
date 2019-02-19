const { Schema } = require('mongoose');

const schema = new Schema({
  // type of resource
  targetType: {
    type: String,
    enum: ['TASK'],
    required: true,
  },
  // what happened with this resource
  operationType: {
    type: String,
    enum: ['UPDATE', 'CREATE', 'DELETE', 'USER_ADDED', 'USER_KICKED'],
    required: true,
  },
  // initiator
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // id of resource that was affected
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // human-readable generated text about affected resource
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
  },
  // extra field depends on type of resource and action
  fieldName: String,
  oldValue: String,
  newValue: String,
});

module.exports = schema;

