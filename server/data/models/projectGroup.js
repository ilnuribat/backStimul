const { Schema } = require('mongoose');

// define ProjectGroup
export default ProjectGrSch = new Schema({
    name: String,
    title: String,
    description: String,
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