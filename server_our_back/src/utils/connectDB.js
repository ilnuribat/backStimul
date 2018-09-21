const mongoose = require('mongoose');
const models = require('../main/models');
const { logger } = require('../utils/logger');
const { MONGODB_HOST } = require('../config');

async function connectToMongo() {
  return new Promise((resolve, reeject) => {
    logger.info('Connecting to mongo...');
    mongoose.connection
      .once('open', () => {
        logger.info('connected to mongo');
        resolve();
      })
      .on('error', (error) => {
        logger.error(error);
        reeject(error);
      });

    mongoose.connect(MONGODB_HOST, {
      useNewUrlParser: true,
    });
  });
}

async function connectToPostgres() {
  logger.info('connecting to postgres...');
  await models.sequelize.authenticate();
  logger.info('connected to postgres');
}

module.exports = {
  connectToMongo,
  connectToPostgres,
};
