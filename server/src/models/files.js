const { Schema } = require('mongoose');

const schema = new Schema({
  taskId: String,
  fileId: String,
  mimetype: String,
});

module.exports = schema;
