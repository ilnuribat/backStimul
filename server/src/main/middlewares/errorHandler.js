const Boom = require('boom');
const { logger } = require('../../utils/logger');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (Boom.isBoom(err)) {
      ctx.status = err.output.statusCode;
      ctx.body = {
        errors: [err.output.payload],
      };

      return;
    }

    ctx.status = 500;
    ctx.body = {
      errors: [{
        name: 'INTERNAL SERVER ERROR',
        debug: err,
      }],
    };
    logger.error(err);
  }
};
