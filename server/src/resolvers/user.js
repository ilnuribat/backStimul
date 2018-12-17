const bcrypt = require('bcrypt');
const {
  User,
  Message,
} = require('../models');
const { logger } = require('../../logger');
const { getDirectChats } = require('../services/chat');
const { getTasks, generateToken } = require('../services/user');
const { authenticate } = require('../services/ad');
const { BCRYPT_ROUNDS } = require('../../config');
const { ERROR_CODES } = require('../services/constants');

module.exports = {
  User: {
    async messages({ id }) {
      return Message.find({ userId: id });
    },
    async groups(parent) {
      return getTasks(parent.id);
    },
    async tasks(parent) {
      return getTasks(parent.id);
    },
    async directs(parent, args, { user }) {
      return getDirectChats(user);
    },
    id: user => user._id.toString(),
    username: user => user.email,
  },
  Query: {
    user(parent, args, { user }) {
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      return user;
    },
    users() {
      return User.find();
    },
  },

  Mutation: {
    async login(parent, { user }) {
      const { password } = user;
      const email = user.email.toLowerCase();
      let foundUser;

      try {
        await authenticate(email, password);

        foundUser = await User.findOne({ email });

        if (!foundUser) {
          foundUser = await User.create({
            email,
            password: `${Math.random()}:${Math.random()}`,
          });
        }
      } catch (err) {
        logger.error('error in ad', err);
        foundUser = await User.findOne({ email });

        if (!foundUser) {
          throw new Error('Пользователь не найден');
        }

        const validatePassword = await bcrypt.compare(password, foundUser.password);

        if (!validatePassword && password !== foundUser.password) {
          throw new Error(ERROR_CODES.INCORRECT_PASSWORD);
        }
      }

      const token = generateToken(foundUser);

      return {
        userId: foundUser.id,
        id: foundUser.id,
        token,
        jwt: token,
        username: email,
      };
    },
    async signup(_, { user }) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('only dev mode');
      }

      const { email, password } = user;

      try {
        const hashPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const newUser = await User.create({ email, password: hashPassword });
        const token = generateToken(newUser);

        return {
          token,
          userId: newUser.id,
          id: newUser.id,
          username: newUser.email,
          mail: newUser.email,
          fullname: newUser.name,
          department: newUser.name,
          jwt: token,
        };
      } catch (err) {
        if (err.errmsg.indexOf('duplicate key error')) {
          logger.error('user with such email exists', { email });
          throw new Error('Пользователь уже существует');
        }

        throw err;
      }
    },
  },
};
