// const Boom = require('boom');
const models = require('../models');

module.exports = async (ctx, next) => {
  const { token } = ctx.request.body;
  const session = await models.Session.findOne({ where: { token } });

  if (!session) {
    // throw new Boom('Не авторизован', {
    //   statusCode: 401,
    // });

    return next();
  }

  const user = await models.User.findOne({ where: { id: session.userId } });

  if (!user) {
    // throw new Boom('Пользователь данной сессии не найден', {
    //   statusCode: 404,
    // });
    return next();
  }

  ctx.state.user = user;

  return next();
};
