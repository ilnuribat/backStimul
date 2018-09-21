import Sequelize from 'sequelize';
import { _ } from 'lodash';
import db from '../connectors';


// define messages
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});
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