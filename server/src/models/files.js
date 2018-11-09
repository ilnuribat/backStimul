const { Schema } = require('mongoose');

const schema = new Schema({
  taskId: String,
  fileId: String,
  mimetype: String,
});

schema.index({ taskId: 1, fileId: 1 }, { unique: true });

module.exports = schema;
