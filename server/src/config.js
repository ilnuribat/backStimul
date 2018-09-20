require('dotenv').config();

const {
  HTTP_PORT = 8500,
  JWT_SECRET = 'super secret',
  POSTGRES_DB = 'guov',
  POSTGRES_USER = 'guov',
  POSTGRES_PASSWORD = 'guov',
  POSTGRES_PORT = 5432,
  POSTGRES_HOST = '127.0.0.1',
  MONGODB_HOST = 'mongodb://127.0.0.1/guov',
  NODE_ENV = 'dev',
  SOCKET_PORT = 4080,
  MICROSERVICES = '',
  LOG_LEVEL = 'info',
  MOLECULER_TRANSPORTER = 'redis://localhost',
} = process.env;

module.exports = {
  HTTP_PORT,
  JWT_SECRET,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_HOST,
  MONGODB_HOST,
  NODE_ENV,
  SOCKET_PORT,
  MICROSERVICES,
  LOG_LEVEL,
  MOLECULER_TRANSPORTER,
};
