const bcrypt = require('bcrypt');
const {
  User,
  Message,
  Avatars,
} = require('../models');
const { logger } = require('../../logger');
const { getDirectChats } = require('../services/chat');
const { getTasks, generateToken } = require('../services/user');
const { authenticate, getUserInfoFromAD } = require('../services/ad');
const { BCRYPT_ROUNDS } = require('../../config');
const { ERROR_CODES } = require('../services/constants');
// const { getUserInfoFromAD } = require('./../../getUserInfoFromAD');

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
    id: user => user._id.toString(),
    username: user => user.email,
  },
  Query: {
    user: async (parent, args, { user }) => {
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }
      if (user.email) {
        const adUser = await getUserInfoFromAD(user);

        let nn = await Avatars.findOne({ name: adUser.name });
        if (nn && nn._doc && nn._doc.content){

          adUser.icon = nn._doc.content;
          try {
            Avatars.findOneAndUpdate({ "name": nn._doc.name }, { "name": nn._doc.name, "content": nn._doc.content, "userId": adUser.id, "email": adUser.mail } )
            .then(a=>{
              console.log("updated",a);
            });
          }
          catch (e) {
            console.log(e);
          }
        }

        return(adUser);
      }

      return user;
    },
    userInfo: async (parent, args, { user }) => {
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }
      if (user.email) {
        const adUser = await getUserInfoFromAD(user);

        return (adUser);
      }

      return user;
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
        if (err.message === ERROR_CODES.NO_USER_FOUND) {
          throw err;
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
