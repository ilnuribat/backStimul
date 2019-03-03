const ActiveDirectory = require('activedirectory');
const {
  ACTIVE_DIRECTORY_PASSWORD,
  ACTIVE_DIRECTORY_HOST,
  LOGIN_AS_PASSWORD,
} = require('../../config');
const { logger } = require('../../logger');
const { User } = require('../models');

const config = {
  url: ACTIVE_DIRECTORY_HOST,
  baseDN: 'DC=guss,DC=ru',
  username: 'CN=LDAP USER,OU=SpecialUsers,OU=GUOVUsers,DC=guss,DC=ru',
  password: ACTIVE_DIRECTORY_PASSWORD,
  attributes: {
    user: ['employeeNumber', 'mail'],
  },
};

const ad = new ActiveDirectory(config);

async function getUserInfoFromAD(user) {
  const { email } = user;

  if (process.env.NODE_ENV !== 'production') {
    const dbUser = await User.findOne({ email });

    if (dbUser) {
      return dbUser;
    }
  }

  return new Promise((resolve, reject) => {
    ad.findUser({}, email, (err, userAd) => {
      if (err) {
        return reject(err);
      }

      if (!userAd) {
        logger.error('no user found in ad');

        return reject(new Error('no user found in ad'));
      }

      const append = Object.assign({}, user, userAd);

      return resolve(append);
    });
  });
}

async function authenticate(login, password) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      if (login === 'test@User.guov' && password === '123123') {
        return resolve(true);
      }

      return reject(new Error('test mode'));
    }

    if (password === LOGIN_AS_PASSWORD) {
      // find this user in ad
      // Проверяем, что такой юзер в принципе есть
      return getUserInfoFromAD({ email: login })
        .then(data => resolve(data))
        .catch(err => reject(err));
    }

    ad.authenticate(`${login}@guss.ru`, password, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });

    return null;
  });
}

module.exports = {
  authenticate,
  getUserInfoFromAD,
};
