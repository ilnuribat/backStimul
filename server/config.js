require('dotenv').config();

const {
  HTTP_PORT = 8500,
  JWT_SECRET = 'super secret',
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
  MONGODB_HOST,
  NODE_ENV,
  SOCKET_PORT,
  MICROSERVICES,
  LOG_LEVEL,
  MOLECULER_TRANSPORTER,
};
