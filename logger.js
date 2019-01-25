const { createLogger, transports, format } = require('winston');
const _ = require('lodash');
const { LOG_LEVEL, MICROSERVICES } = require('./config');

const {
  combine, timestamp, label, printf, colorize, metadata,
} = format;

const customFormat = printf(log => `${
  log.level
}: ${
  log.timestamp
}: ${
  log.label
} ${
  log.message
} ${
  _.isEmpty(log.metadata) ? '' : JSON.stringify(_.omit(log.metadata, 'label', 'timestamp'))
}`);

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
