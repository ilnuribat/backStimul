const mongoose = require('mongoose');

const group = require('./group');
const user = require('./user');
const userGroup = require('./userGroup');
const message = require('./message');
const files = require('./files');

delete mongoose.connection.models.groups;
delete mongoose.connection.models.users;
delete mongoose.connection.models.userGroups;
delete mongoose.connection.models.messages;
delete mongoose.connection.models.files;

module.exports = {
  Group: mongoose.model('groups', group),
  User: mongoose.model('users', user),
  UserGroup: mongoose.model('userGroups', userGroup),
  Message: mongoose.model('messages', message),
  Files: mongoose.model('files', files),
  Schemas: {
    Group: group,
    User: user,
    UserGroup: userGroup,
    Message: message,
    Files: files,
  },
};
