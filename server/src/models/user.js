const { Schema } = require('mongoose');

const user = new Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

user.virtual('username').get(function () {
  return this.email;
});

module.exports = user;