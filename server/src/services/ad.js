const ActiveDirectory = require('activedirectory');
const {
  ACTIVE_DIRECTORY_PASSWORD,
  ACTIVE_DIRECTORY_HOST,
  LOGIN_AS_PASSWORD,
} = require('../../config');
const { ERROR_CODES } = require('./constants');


const config = {
  url: ACTIVE_DIRECTORY_HOST,
  baseDN: 'DC=guss,DC=ru',
  username: 'CN=LDAP USER,OU=SpecialUsers,OU=GUOVUsers,DC=guss,DC=ru',
  password: ACTIVE_DIRECTORY_PASSWORD,
  attributes: {
    user: [
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
          return reject(ERROR_CODES.NO_USER_FOUND);
        }
        if (data.mail.split('@')[0].toLowerCase() !== login.toLowerCase()) {
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
  return new Promise((resolve, reject) => {
    ad.findUser({ scope: 'sub' }, user.email, (err, userAd) => {
      if (err) {
        return reject(err);
      }

      if (!userAd) {
        reject(new Error(ERROR_CODES.NO_USER_FOUND));
      }

      let initials = '';

      if (userAd && userAd.name) {
        const F = userAd.name.replace(/ +(?= )/g, '').split(' ')[0];
        const I = userAd.name.replace(/ +(?= )/g, '').split(' ')[1].split('')[0];
        const O = userAd.name.replace(/ +(?= )/g, '').split(' ')[2].split('')[0];

        initials = `${F} ${I}.${O}.`;
      }

      const append = Object.assign({}, { initials }, user, userAd);

      return resolve(append);
    });
  });
}

module.exports = {
  authenticate,
  getUserInfoFromAD,
};
