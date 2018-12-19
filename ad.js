const ActiveDirectory = require('activedirectory');

const config = {
  url: 'ldap://pdcg.guss.ru',
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
      'primaryGroupID']
  }
};

const ad = new ActiveDirectory(config);

    let username = 'Tolstobrov.AY';
    username = 'tolstobrov.ay';

ad.findUser({ scope: 'sub' }, username, function (err, user) {
  if (err) {
    console.log('-----------------------ERROR: ' + JSON.stringify(err));
    return;
  }
  if (!user) console.log('-----------------------User: ' + username + ' not found.');
  else console.log(user);
});

