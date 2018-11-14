const chai = require('chai');
const chaiHttp = require('chai-http');
const { generateToken } = require('../server/src/services/user');
const connectDB = require('../server/connectDB');
const { User } = require('../server/src/models');
const { app } = require('../server');

before(async function () {
  chai.use(chaiHttp);
  const requester = chai.request(app).keepOpen();

  await connectDB();

  this.email = 'test@User.guov';
  this.password = '123123';

  this.user = await User.create({
    email: this.email,
    password: this.password,
  });

  const generatedToken = generateToken(this.user);

  this.request = ({ query, token, bearer }) => requester
    .post('/')
    .send({ query })
    .set('Authorization', `${
      bearer === false ? '' : 'Bearer'
    } ${token || generatedToken}`)
    .then(r => r.body);

  const query = `
    {
      user {
        id
        email
      }
    }
  `;

  const res = await this.request({ query, bearer: false });

  console.log(res);
});

after(async function () {
  await User.deleteOne({
    email: this.email,
  });
});
