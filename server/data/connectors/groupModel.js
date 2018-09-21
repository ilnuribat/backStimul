const { Schema } = require('mongoose');


module.exports = new Schema({
  name: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});