const mongoose = require('mongoose');

const groupModel = require('./group');
const userModel = require('./user');
const userGroupModel = require('./userGroup');

const db = {
  Group: mongoose.model('groups', groupModel),
  User: mongoose.model('users', userModel),
  UserGroup: mongoose.model('userGroups', userGroupModel),
};

module.exports = db;
