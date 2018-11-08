const { Schema } = require('mongoose');

const schema = new Schema({
  taskId: Schema.Types.ObjectId,
  fileId: Schema.Types.ObjectId,
});

schema.index({ taskId: 1, fileId: 1 }, { unique: true });

module.exports = schema;
