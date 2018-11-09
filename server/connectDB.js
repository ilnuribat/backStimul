const mongoose = require('mongoose');
const { logger } = require('./logger');
const { MONGODB_HOST } = require('./config');

module.exports = async function () {
  return new Promise((resolve, reject) => {
    logger.info('Connecting to mongo...');
    mongoose.connection
      .once('open', () => {
        logger.info('connected to mongo');
        resolve();
      })
      .on('error', (error) => {
        logger.error(error);
        reject(error);
      });

    mongoose.set('debug', true);

    mongoose.connect(MONGODB_HOST, {
      useNewUrlParser: true,
    });
  });
};
