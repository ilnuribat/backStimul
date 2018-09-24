const { Schema } = require('mongoose');

module.exports = new Schema({
  title: String,
  description: String,
  deletedAt: Date,
  hide: { type: Boolean, default: false },
  columnId: String,
  createdBy: String,
  priority: {
    type: Number,
    default: 3,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});
