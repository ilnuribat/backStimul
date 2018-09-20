const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = require('./src/config');
const { logger } = require('./src/utils/logger');


module.exports = {
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
  migrationStorageTableName: '_migrations',
};
