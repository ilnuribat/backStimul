const { Schema } = require('mongoose');

const schema = new Schema({
  userId: Schema.Types.ObjectId, // from user
  groupId: Schema.Types.ObjectId, // to group
  text: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  createdAt_: Date,
  isDirect: Boolean,
});

// schema.virtual('createdAt').get(function () {
//   return this.createdAt_.toString();
// });

module.exports = schema;
