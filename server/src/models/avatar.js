const { Schema } = require('mongoose');

const { ObjectId } = Schema.Types;

const schema = new Schema({
  userId: ObjectId,
  content: String,
  name: String,
  email: String,
});

module.exports = schema;
