const bcrypt = require('bcrypt');
const {
  User,
  Message,
} = require('../models');
const { logger } = require('../../logger');
const { getDirectChats } = require('../services/chat');
const { getTasks, generateToken } = require('../services/user');
const { authenticate, getUserInfoFromAD } = require('../services/ad');
const { BCRYPT_ROUNDS } = require('../../config');
const { ERROR_CODES } = require('../services/constants');

module.exports = {
  User: {
    async messages({ id }) {
      return Message.find({ userId: id });
    },
    async groups(parent) {
      return getTasks(parent._id);
    },
    async tasks(parent) {
      return getTasks(parent._id);
    },
    async directs(parent, args, { user }) {
      return getDirectChats(user);
    },
    id: user => user.id || user._id.toString(),
    username: user => user.email,
    icon: async (user) => {
      if (user && user.name) {
        const name = user.name.replace(/\s/gi, '%20');

        return `http://185.168.187.103:8000/img/${name}`;
      }

      return '';
    },
  },
  Query: {
    user: async (parent, args, { user }) => {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      const adUser = await getUserInfoFromAD(user);

      return adUser;
    },
    userInfo: async (parent, args, { user }) => {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      const adUser = await getUserInfoFromAD(user);

      return adUser;
    },
    users: async () => {
      const allUsers = await User.find({});

      return Promise.all(allUsers.map(user => getUserInfoFromAD(user)));
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
        logger.error({ err });
        if (err === ERROR_CODES.NO_USER_FOUND) {
          throw new Error(err);
        }

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
