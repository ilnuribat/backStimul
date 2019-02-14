const { Schema } = require('mongoose');

const user = new Schema({
  id1C: String,
  email: String,
  firstName: {
    type: String,
    required: true,
    default: 'TEST!!!',
  },
  lastName: {
    type: String,
    required: true,
    default: 'TEST!!!',
  },
  middleName: {
    type: String,
    required: true,
    default: 'TEST!!!',
  },
  specialization: String,
  isWorking: Boolean,
  birthdate: String,
  OU: [String],
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

module.exports = user;
