const { Schema } = require('mongoose');

const schema = new Schema({
  taskId: Schema.Types.String,
  fileId: Schema.Types.String,
});

schema.index({ taskId: 1, fileId: 1 }, { unique: true });

module.exports = schema;
