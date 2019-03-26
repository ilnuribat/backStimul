const {
  User,
  Message,
} = require('../models');
const { getDirectChats } = require('../services/chat');
const { getTasks, generateToken } = require('../services/user');
const { authenticate, getUserInfoFromAD } = require('../services/ad');
const { ERROR_CODES } = require('../services/constants');
const { logger } = require('../../logger');

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
    id: ({ id, _id }) => id || _id.toString(),
    username: user => user.email,
    icon: user => `https://dev.scis.xyz/images/${user.fullName}`,
    name: ({ firstName }) => firstName,
    notifications: (parent, { limit = 10, offset = 0 }) => ({ limit, offset }),
  },
  Query: {
    user: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      if (id) {
        return User.findById(id);
      }

      return user;
    },
    users: async () => User.find({ email: { $exists: true } }).lean(),
  },

  Mutation: {
    async login(parent, { user }) {
      const { password } = user;
      const email = user.email.toLowerCase();

      // Проверяем пароль в AD
      await authenticate(email, password);

      // Получаем id от 1С
      const adUser = await getUserInfoFromAD({ email });

      // Проверяем по этому айдишнику по базе в монго, есть ли такой юзер
      const rawUser = await User.findOne({
        id1C: adUser.employeeNumber,
      }).lean();

      // обновляем поле email в монго,
      // потому что могло просто напросто поменяться почта

      const answer = await User.updateOne({ _id: rawUser._id }, { email: adUser.mail });

      logger.info({ adUser, rawUser, answer });

      const token = generateToken(rawUser);

      return {
        userId: rawUser._id.toString(),
        id: rawUser._id.toString(),
        token,
        jwt: token,
        username: email,
      };
    },
  },
};
