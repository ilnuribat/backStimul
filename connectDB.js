const mongoose = require('mongoose');
const { Pool } = require('pg');
const { logger } = require('./logger');
const { MONGODB_HOST, PG_FIAS } = require('./config');

const pool = new Pool({
  connectionString: PG_FIAS,
});


async function connect({ connection = MONGODB_HOST, mongo = true, pg = true } = {}) {
  if (mongo) {
    mongoose.set('debug', !['test', 'production'].includes(process.env.NODE_ENV));
    logger.info('connecting to mongo...', { connection });
    await mongoose
      .connect(connection, {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 1000,
      })
      .then(() => logger.info('connected to mongo'));
  }
  if (pg) {
    logger.info('connecting to postgres...', { PG_FIAS });
    global.pgClient = await pool.connect()
      .catch((err) => {
        logger.error('failed to connect postgres', err);
        process.exit(1);
      });

    logger.info('connected to postgres');
  }
}

async function disconnect() {
  return mongoose.disconnect();
}

module.exports = {
  connect,
  disconnect,
};
