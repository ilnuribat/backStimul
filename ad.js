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

// var username = 'LDAP USER';
// var password = '2wKzTrzIs7mCHb';
// ad.authenticate(username, password, function (err, auth) {
//   if (err) {
//     console.log('ERROR: ' + JSON.stringify(err));
//     return;
//   }

//   if (auth) {
//     console.log('Authenticated!');

//     let username = 'Tolstobrov.AY';
//     username = 'tolstobrov.ay';


// ad.findUser({ scope: 'sub'}, username, function (err, user) {
//   if (err) {
//     console.log('-----------------------ERROR: ' + JSON.stringify(err));
//     return;
//   }
//   // tolstobrov.ay
//   if (!user) console.log('-----------------------User: ' + username + ' not found.');
//   // else console.log(JSON.stringify(user));
//   else console.log(user);
// });

//   }
//   else {
//     console.log('Authentication failed!');
//   }
// });


// console.log( "config", config);

// let user = 'mail=Tolstobrov.AY@guov.ru';


// ad.findUser({ scope: 'sub'}, user, function (err, user) {
//   if (err) {
//     console.log('-----------------------ERROR: ' + JSON.stringify(err));
//     return;
//   }
//   // tolstobrov.ay
//   if (!user) console.log('-----------------------User: ' + user + ' not found.');
//   // else console.log(JSON.stringify(user));
//   else console.log(user);
// });