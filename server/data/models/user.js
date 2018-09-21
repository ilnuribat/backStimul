const { Schema } = require('mongoose');

// define UserSch
export default UserSch = new Schema({
    firstname: String,
    lastname: String,
    name: String,
    description: String,
    pinkey: String,
    email: { type: String, default: 'User', unique: true },
    password: String,
    groupId: { type: String, default: 'none' },
    createdBy: String,
    deletedAt: Date,
    hide: { type: Boolean, default: false },
    type: { type: String, default: 'User' },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});