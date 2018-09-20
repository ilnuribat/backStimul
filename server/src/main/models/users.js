const { Schema } = require('mongoose');

module.exports = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  // Don't return password unless specified to
  password: { type: String, select: false },
  todos: [
    {
      content: { type: String },
    },
  ],
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});
