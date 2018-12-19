const ActiveDirectory = require('activedirectory');
/** ***** */

const config = {
  url: 'ldap://10.0.20.105',
  baseDN: 'DC=guss,DC=ru',
  username: 'LDAP USER',
  password: '2wKzTrzIs7mCHb',
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
const adsifyUser = (user) => {
  return new Promise((resolve, reject) => {
    ad.findUser({ scope: 'sub' }, user.email, (err, userAd) => {
      if (err) {
        console.log(JSON.stringify(err));
        resolve(user);
      }
      if (!userAd) {
        resolve(user);
      }

      let usr = user;

      if (user._doc) {
        usr = user._doc
      }
      let initials = '';
      if (userAd && userAd.name){
        let F = userAd.name.replace(/ +(?= )/g, '').split(' ')[0];
        let I = userAd.name.replace(/ +(?= )/g, '').split(' ')[1].split('')[0];
        let O = userAd.name.replace(/ +(?= )/g, '').split(' ')[2].split('')[0];

        initials = `${F} ${I}.${O}.`;
      }
      
      console.log("----------------------------------initials----------------------------------");
      console.log('-----initi',initials);
      
      let append = Object.assign({}, { initials: initials }, usr, user, userAd);
      resolve(append);


    });
  });
};

module.exports = {
  adsifyUser
}
/** ***** */