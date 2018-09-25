const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { User } = require('../models');
const { logger } = require('../../logger');

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    password: user.password.slice(-10),
  }, JWT_SECRET);
}

module.exports = {
  Query: {
    user(parent, { email, id }) {
      return User.findOne({ $or: [{ _id: id }, { email }] });
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

      if (!validatePassword) {
        throw new Error('password is incorrect');
      }

      const token = generateToken(foundUser);

      return {
        userId: foundUser.id,
        token,
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
          id: user.id,
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
