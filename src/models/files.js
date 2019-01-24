const { Schema } = require('mongoose');

const { ObjectId } = Schema.Types;

const schema = new Schema({
  taskId: ObjectId,
  fileId: ObjectId,
  mimetype: String,
});

module.exports = schema;
