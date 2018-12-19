const { Schema } = require('mongoose');

const { ObjectId } = Schema.Types;

const schema = new Schema({
  name: String,
  content: String,
  email: String,
  userId: ObjectId,
});

module.exports = schema;
