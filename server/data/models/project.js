const { Schema } = require('mongoose');

// define Project
module.exports = new Schema({
  name: String,
  title: String,
  description: String,
  parentId: String,
  createdBy: String,
  deletedAt: Date,
  hide: { type: Boolean, default: false },
  type: { type: String, default: 'Project' },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});
