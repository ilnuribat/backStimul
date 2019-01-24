const ActiveDirectory = require('activedirectory');
const {
  ACTIVE_DIRECTORY_PASSWORD,
  ACTIVE_DIRECTORY_HOST,
  LOGIN_AS_PASSWORD,
} = require('../../config');
const { ERROR_CODES } = require('./constants');
const { logger } = require('../../logger');

const config = {
  url: ACTIVE_DIRECTORY_HOST,
  baseDN: 'DC=guss,DC=ru',
  username: 'CN=LDAP USER,OU=SpecialUsers,OU=GUOVUsers,DC=guss,DC=ru',
  password: ACTIVE_DIRECTORY_PASSWORD,
  attributes: {
    user: [
      'employeeNumber',
      'dn',
      'cn',
      'mail',
      'giveName',
      'department',
      'badPasswordTime',
      'badPwdCount',
      'company',
      'description',
      'displayName',
      'name',
      'sn',
      'title',
      'primaryGroupID'],
  },
};

const ad = new ActiveDirectory(config);

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
      return ad.findUser(login, (err, data) => {
        if (err) {
          return reject(err);
        }

        if (!data) {
          logger.error('no data from ad', data);

          return reject(ERROR_CODES.NO_USER_FOUND);
        }

        return resolve(data);
      });
    }

    return ad.authenticate(`${login}@guss.ru`, password, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}

async function getUserInfoFromAD(user) {
  if (process.env.NODE_ENV === 'test') {
    return user;
  }

  return new Promise((resolve, reject) => {
    const opts = {};
    let { email } = user;

    if (user.employeeNumber) {
      opts.filter = `(employeeNumber=${user.employeeNumber})`;
      email = null;
    }

    ad.findUser(opts, email, (err, userAd) => {
      if (err) {
        return reject(err);
      }

      if (!userAd) {
        logger.error('no user found in ad');

        return resolve(user);
      }

      const append = Object.assign({}, { initials: userAd.name }, user, userAd);

      return resolve(append);
    });
  });
}

module.exports = {
  authenticate,
  getUserInfoFromAD,
};
