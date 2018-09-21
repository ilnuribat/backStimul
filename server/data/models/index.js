const mongoose = require('mongoose');

const columnModel = require('./column');
const projectModel = require('./project');
const taskSchema = require('./task');
const userModel = require('./user');
const projectGroupModel = require('./projectGroup');

const db = {
  Column: mongoose.model('Column', columnModel),
  Project: mongoose.model('Project', projectModel),
  ProjectGroup: mongoose.model('ProjectGroup', projectGroupModel),
  Task: mongoose.model('Task', taskSchema),
  User: mongoose.model('User', userModel),
};

module.exports = db;
