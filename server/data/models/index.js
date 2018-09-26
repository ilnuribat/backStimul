const mongoose = require('mongoose');

const group = require('./group');
const user = require('./user');
const userGroup = require('./userGroup');
const message = require('./message');

const db = {
  Group: mongoose.model('groups', group),
  User: mongoose.model('users', user),
  UserGroup: mongoose.model('userGroups', userGroup),
  Message: mongoose.model('messages', message),
};

module.exports = db;
