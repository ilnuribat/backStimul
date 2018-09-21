const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const { JWT_SECRET } = require('../../config');

module.exports = {
  Mutation: {
    signup: async (_, { name, email, password }) => {
      let user = await models.Users.findOne({ email }).lean();

      if (user) {
        throw new Error('Email is already taken');
      }

      const curPassword = await bcrypt.hash(password, 10);

      user = await new models.Users({ name, email, password: curPassword }).save();

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      return { token, user };
    },

    login: async (_, { email, password }) => {
      try {
        const user = await models.Users.findOne({ email }, { password: 1, name: 1 }).lean();

        if (!user) {
          throw new Error('No such user found');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new Error('Invalid password');
        }

        // remove password from user object which will be returned
        user.password = undefined;

        return {
          token: jwt.sign({ userId: user.id }, JWT_SECRET),
          user,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },

};
