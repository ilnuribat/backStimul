import { _ } from 'lodash';
const { Schema } = require('mongoose');

// define messages
export default PrioritySch = new Schema({
    name: String,
    title: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});