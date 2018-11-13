const request = require('request-promise-native');
const connectDB = require('../server/connectDB');
const { User } = require('../server/src/models');

before(async function () {
  await connectDB();

  this.email = 'test@User.guov';
  this.password = '123123';

  this.user = await User.create({
    email: this.email,
    password: this.password,
  });

  this.request = request.defaults({
    method: 'POST',
    uri: 'http://localhost:8500/',
    headers: {
      'content-type': 'application/json',
    },
    json: true,
  });
});

after(async function () {
  await User.deleteOne({
    email: this.email,
  });
});
