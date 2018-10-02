const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const {
  User,
  Message,
  Group,
  UserGroup,
} = require('../models');
const { logger } = require('../../logger');

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
    async groups({ id }) {
      const usersGroups = await UserGroup.find({ userId: id });

      return Group.find({
        _id: {
          $in: usersGroups.map(u => u.groupId),
        },
        code: null,
      });
    },
    async directs({ id }) {
      const usersGroups = await UserGroup.find({ userId: id });

      return Group.find({
        _id: {
          $in: usersGroups.map(u => u.groupId),
        },
        code: {
          $exists: true,
        },
      });
    },
    id: user => user._id.toString(),
  },
  Query: {
    user(parent, args, { user }) {
      if (!user) {
        throw new Error('not authenticated');
      }

      return User.findById(user.id);
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

      if (!validatePassword) {
        throw new Error('password is incorrect');
      }

      const token = generateToken(foundUser);

      return {
        userId: foundUser.id,
        id: foundUser.id,
        token,
        jwt: token,
        username: 'test',
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
