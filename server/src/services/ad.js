const ActiveDirectory = require('activedirectory');
const { ACTIVE_DIRECTORY_PASSWORD, ACTIVE_DIRECTORY_HOST } = require('../../config');

const config = {
  url: ACTIVE_DIRECTORY_HOST,
  baseDN: 'DC=guss,DC=ru',
  username: 'CN=LDAP USER,OU=SpecialUsers,OU=GUOVUsers,DC=guss,DC=ru',
  password: ACTIVE_DIRECTORY_PASSWORD,
};

const ad = new ActiveDirectory(config);

async function authenticate(login, password) {
  return new Promise((resolve, reject) => {
    ad.authenticate(`${login}@guss.ru`, password, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}

module.exports = {
  authenticate,
};
