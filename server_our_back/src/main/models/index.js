const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = require('../../config');

const associate = require('./associations');

const columnModel = require('./column');
const projectModel = require('./project');
const projectUserModel = require('./projectUser');
const taskSchema = require('./task');
const userModel = require('./user');
const usersModel = require('./users');
const projectGroupModel = require('./projectGroup');
const sessionModel = require('./session');
const glossaryPriorityModel = require('./glossaryPriority');
const { logger } = require('../../utils/logger');

const sequelize = new Sequelize({
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
  host: POSTGRES_HOST,
  dialect: 'postgres',
  pool: {
    min: 10,
    max: 30,
  },
  logging: logger.silly,
  operatorsAliases: false,
});

const tableOptions = { freezeTableName: true, timestamps: false };

const db = {
  Column: sequelize.define('Column', columnModel, tableOptions),
  Project: sequelize.define('Project', projectModel, tableOptions),
  ProjectGroup: sequelize.define('ProjectGroup', projectGroupModel, tableOptions),
  ProjectUser: sequelize.define('ProjectUser', projectUserModel, tableOptions),
  Task: mongoose.model('Task', taskSchema),
  Users: mongoose.model('Users', usersModel),
  User: sequelize.define('User', userModel, tableOptions),
  Session: sequelize.define('Session', sessionModel, tableOptions),
  GlossaryPriority: sequelize.define('GlossaryPriority', glossaryPriorityModel, tableOptions),
  sequelize,
};

associate(db);

module.exports = db;
