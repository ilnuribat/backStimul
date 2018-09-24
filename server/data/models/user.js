const { Schema } = require('mongoose');

module.exports = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstname: String,
  lastname: String,
  name: String,
  description: String,
  pinkey: String,
  groupId: { type: String, default: 'none' },
  createdBy: String,
  deletedAt: Date,
  hide: { type: Boolean, default: false },
  type: { type: String, default: 'User' },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});
