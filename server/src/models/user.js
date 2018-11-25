const { Schema } = require('mongoose');

const user = new Schema({
  email: String,
  password: String,
  name: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

module.exports = user;
