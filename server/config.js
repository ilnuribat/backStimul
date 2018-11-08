require('dotenv').config();

const {
  HTTP_PORT = 8500,
  JWT_SECRET = 'super secret',
  MONGODB_HOST = 'MONGODB_HOST=mongodb://guov:guov@127.0.0.1:27017/guov?authSource=admin',
  NODE_ENV = 'dev',
  SOCKET_PORT = 4080,
  MICROSERVICES = '',
  LOG_LEVEL = 'info',
  MOLECULER_TRANSPORTER = 'redis://localhost',
  DADATA_API = 'a9a4c39341d2f4072db135bd25b751336b1abb83',
  DADATA_SECRET = '23244c4269211592e162cdb28f459b82716f50d8',
  PG_FIAS = 'postgresql://guov:guov@127.0.0.1/fias',
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
  DADATA_API,
  DADATA_SECRET,
  PG_FIAS,
};
