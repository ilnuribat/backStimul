const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const {
  User,
  Message,
} = require('../models');
const { logger } = require('../../logger');
const { getDirectChats } = require('../services/chat');
const { getTasks } = require('../services/user');

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    password: user.password.slice(-10),
  }, JWT_SECRET);
}

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
  },
  Query: {
    user(parent, args, { user }) {
      if (!user) {
        throw new Error('not authenticated');
      }

      return user;
    },
    users() {
      return User.find();
    },
  },

  Mutation: {
    async login(parent, { user }) {
      const { email, password } = user;
      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        throw new Error('no user found with such email');
      }

      const validatePassword = await bcrypt.compare(password, foundUser.password);

      if (!validatePassword && password !== foundUser.password) {
        throw new Error('password is incorrect');
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
      const { email, password } = user;

      try {
        const hashPassword = await bcrypt.hash(password, 12);
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
          throw new Error('user with such email exists');
        }

        throw err;
      }
    },
  },
};
