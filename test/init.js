const request = require('request-promise-native');
const { generateToken } = require('../server/src/services/user');
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

  const token = generateToken(this.user);

  this.requestNoAuth = request.defaults({
    method: 'POST',
    uri: 'http://localhost:8500/',
    json: true,
  });

  this.request = this.requestNoAuth.defaults({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
});

after(async function () {
  await User.deleteOne({
    email: this.email,
  });
});
