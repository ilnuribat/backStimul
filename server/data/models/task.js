const { Schema } = require('mongoose');

export default TaskSch = new Schema({
  name: String,
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
