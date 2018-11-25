const mongoose = require('mongoose');
const { logger } = require('./logger');
const { MONGODB_HOST } = require('./config');

module.exports = async function (connection = MONGODB_HOST) {
  mongoose.set('debug', !['test', 'production'].includes(process.env.NODE_ENV));

  return mongoose
    .connect(connection, {
      useNewUrlParser: true,
      autoIndex: false,
      connectTimeoutMS: 1000,
    })
    .then(() => logger.info('connected to mongo'));
};
