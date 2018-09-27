const { ServiceBroker } = require('moleculer');
const winston = require('winston');
const { logFormat } = require('./logger');
const { MOLECULER_TRANSPORTER, MICROSERVICES } = require('./config');

function extend(logger) {
  return {
    ...logger,
    fatal: logger.error,
    trace: logger.silly,
  };
}

module.exports = new ServiceBroker({
  transporter: MOLECULER_TRANSPORTER,
  nodeID: `${MICROSERVICES}:${Date.now()}`,
  logger: () => extend(winston.createLogger({
    format: logFormat,
    transports: [
      new winston.transports.Console(),
    ],
  })),
});
