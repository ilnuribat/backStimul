const { createLogger, transports, format } = require('winston');
const { LOG_LEVEL, MICROSERVICES } = require('../config');

const {
  combine, timestamp, label, printf, colorize, metadata,
} = format;

function handleMeta(meta) {
  return Object.keys(meta)
    .map(key => `${key}: ${meta[key]}`)
    .join(', ');
}

const customFormat = printf(log => `${log.level} [${log.timestamp}]: ${log.label} ${log.message} ${handleMeta(log.metadata)}`);

const logFormat = combine(
  colorize(),
  metadata(),
  label({ label: MICROSERVICES }),
  timestamp(),
  customFormat,
);

const logger = createLogger({
  level: LOG_LEVEL,
  format: logFormat,
  transports: [
    new transports.Console(),
  ],
});

module.exports = {
  logger,
  logFormat,
};
