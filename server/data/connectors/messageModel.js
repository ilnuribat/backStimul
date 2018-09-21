import { _ } from 'lodash';
const { Schema } = require('mongoose');


// define messages
const MessageModel = new Schema({
  fileurl: String,
  text: String,
  userid: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});