const ActiveDirectory = require('activedirectory');
const { ACTIVE_DIRECTORY_PASSWORD, ACTIVE_DIRECTORY_HOST } = require('./config');

const config = {
  url: ACTIVE_DIRECTORY_HOST,
  baseDN: 'DC=guss,DC=ru',
  username: 'LDAP USER',
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

const adsifyUser = user => new Promise((resolve, reject) => {
  ad.findUser({ scope: 'sub' }, user.email, (err, userAd) => {
    // user.name = "aaaa" + JSON.stringify(err)
    // resolve(user)
    // return (user)
    if (err) {
      // console.log(JSON.stringify(err));
      resolve(user);
    }
    if (!userAd) {
      resolve(user);
    }

    let usr = user;

    if (user._doc) {
      usr = user._doc;
    }
    let initials = '';

    if (userAd && userAd.name) {
      const F = userAd.name.replace(/ +(?= )/g, '').split(' ')[0];
      const I = userAd.name.replace(/ +(?= )/g, '').split(' ')[1].split('')[0];
      const O = userAd.name.replace(/ +(?= )/g, '').split(' ')[2].split('')[0];

      initials = `${F} ${I}.${O}.`;
    }

    const append = Object.assign({}, { initials }, usr, user, userAd);

    resolve(append);
  });
});

module.exports = {
  adsifyUser,
};
/** ***** */
