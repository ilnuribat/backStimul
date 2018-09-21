import { _ } from 'lodash';
const { Schema } = require('mongoose');


// define messages
export default ColumnSch = new Schema({
    name: String,
    title: String,
    order: Number,
    projectId: Number,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});