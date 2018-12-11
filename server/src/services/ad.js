const ActiveDirectory = require('activedirectory');

const config = {
  url: 'ldap://pdcg.guss.ru',
  baseDN: 'DC=guss,DC=ru',
  username: 'CN=LDAP USER,OU=SpecialUsers,OU=GUOVUsers,DC=guss,DC=ru',
  password: '2wKzTrzIs7mCHb',
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
