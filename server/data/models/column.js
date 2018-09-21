import { _ } from 'lodash';
const { Schema } = require('mongoose');


// define messages
export default ColumnSch = new Schema({
    name: String,
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