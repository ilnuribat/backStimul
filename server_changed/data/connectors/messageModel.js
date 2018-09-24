const { Schema } = require('mongoose');


module.exports = new Schema({
  fileurl: String,
  text: String,
  userId: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});
