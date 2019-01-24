const { Schema } = require('mongoose');

const user = new Schema({
  email: String,
  password: String,
  name: String,
  cn: String,
  mail: String,
  company: String,
  department: String,
  description: String,
  displayName: String,
  sn: String,
  title: String,
  primaryGroupId: String,
  initials: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

module.exports = user;
