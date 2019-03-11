const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const notifyevents = new Schema({
  userId: String,
  parentId: String,
  type: String,
  date: String,
  text: String,
  createdAt: String,
  updatedAt: String,
});
// const usersId = new Schema({
//   userId: String,
// });
const notify = new Schema({
  userId: String,
  name: String,
  groupId: String,
  entityId: String,
  notyId: String,
  parentId: String,
  lastUpdate: String,
  lastMessage: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: String,
  updatedAt: String,
  events: [notifyevents],
  usersId: [String],
});

const transition = new Schema({
  userId: Schema.Types.ObjectId,
  usersId: [Schema.Types.ObjectId],
  entityId: Schema.Types.ObjectId,
  data: String,
});

module.exports.notify = mongoose.model('notifies', notify);
module.exports.notifyevents = mongoose.model('notifyevents', notifyevents);
module.exports.transition = mongoose.model('transition', transition);
