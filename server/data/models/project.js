const { Schema } = require('mongoose');

// define Project
export default ProjectSch = new Schema({
    name: String,
    title: String,
    description: String,
    parentId: String,
    createdBy: String,
    type: { type: String, default: 'Project' },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});