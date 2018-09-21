const { logger } = require('../../utils/logger');

module.exports = (ctx, next) => {
  logger.info('request log:', { path: ctx.request.path });

  return next();
};
