const { Schema } = require('mongoose');

module.exports = new Schema({
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  columnId: Number,
  createdBy: Number,
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
