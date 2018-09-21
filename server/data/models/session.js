const { Schema } = require('mongoose');

// define SessionSch
export default SessionSch = new Schema({
  token: String,
  userId: String,
  ip: String,
  userAgent: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});