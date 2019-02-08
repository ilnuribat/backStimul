const { Schema } = require('mongoose');

const user = new Schema({
  id1C: String,
  email: String,
  firstName: String,
  lastName: String,
  middleName: String,
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
