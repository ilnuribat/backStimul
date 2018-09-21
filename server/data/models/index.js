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
const taskSchema = require('./task');
const userModel = require('./user');
const projectGroupModel = require('./projectGroup');
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
  Column: mongoose.model('Column', columnModel),
  Project: mongoose.model('Project', projectModel),
  ProjectGroup: mongoose.model('ProjectGroup', projectGroupModel),
  Task: mongoose.model('Task', taskSchema),
  User: mongoose.model('User', userModel),
  sequelize,
};

module.exports = db;
