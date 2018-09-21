import { _ } from 'lodash';
const { Schema } = require('mongoose');

// define users
const UserModel = new Schema({
  email: String,
  username: String,
  password: String,
  version: String, // version the password
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});