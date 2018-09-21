const Boom = require('boom');
const Router = require('koa-router');
const bcrypt = require('bcrypt');
const { User, Session } = require('./models');

const router = new Router({ prefix: '/auth' });

router
  .post('/register', async (ctx) => {
    const { email, password } = ctx.request.body;

    const hash = await bcrypt.hash(password, 12);

    try {
      const user = await User.create({
        email,
        password: hash,
      });

      ctx.body = {
        id: user.id,
      };
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new Boom('Данный email уже используется', {
          statusCode: 403,
        });
      }

      throw err;
    }
  })
  .post('/login', async (ctx) => {
    const { login, password } = ctx.request.body;

    const user = await User.findOne({ where: { email: login } });

    if (!user) {
      throw new Boom(null, {
        message: 'Пользователь с таким login-ом не найден',
        statusCode: 404,
      });
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new Boom(null, {
        message: 'Неверный пароль',
        statusCode: 403,
      });
    }

    // create session
    const session = await Session.create({ userId: user.id });

    ctx.cookies.set('sid', session.token, {
      httpOnly: true,
    });

    ctx.body = session;
  });

module.exports = router;
