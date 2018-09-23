const { Schema } = require('mongoose');

module.exports = new Schema({
  title: String,
  order: Number,
  projectId: Number,
  parentId: String,
  createdBy: String,
  deletedAt: Date,
  hide: { type: Boolean, default: false },
  type: { type: String, default: 'ProjectGroup' },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});
