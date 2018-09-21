const { Schema } = require('mongoose');


// define messages
export default GroupSch = new Schema({
    name: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});