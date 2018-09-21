const { Schema } = require('mongoose');


// define GroupSch
export default GroupSch = new Schema({
    name: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});