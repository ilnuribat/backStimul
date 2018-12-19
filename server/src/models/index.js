const mongoose = require('mongoose');

const group = require('./group');
const user = require('./user');
const userGroup = require('./userGroup');
const message = require('./message');
const files = require('./files');
const avatars = require('./avatars');

module.exports = {
  Group: mongoose.model('groups', group),
  User: mongoose.model('users', user),
  UserGroup: mongoose.model('userGroups', userGroup),
  Message: mongoose.model('messages', message),
  Files: mongoose.model('files', files),
  Avatars: mongoose.model('avatars', avatars),
  Schemas: {
    Group: group,
    User: user,
    UserGroup: userGroup,
    Message: message,
    Files: files,
  },
};
