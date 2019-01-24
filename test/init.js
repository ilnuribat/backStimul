const chai = require('chai');
const chaiHttp = require('chai-http');
const { generateToken } = require('../src/services/user');
const { User } = require('../src/models');
const { server } = require('../index');

before(async function () {
  chai.use(chaiHttp);
  const requester = chai.request(server).keepOpen();

  this.httpPort = () => server.address().port;

  this.email = 'test@User.guov';
  this.password = '123123';

  this.user = await User.create({
    email: this.email,
    password: this.password,
    id1C: Math.random(),
  });

  this.generatedToken = generateToken(this.user);

  this.request = ({
    query,
    token,
    bearer,
    noAuthorization,
  }) => {
    const headerName = noAuthorization ? 'none' : 'Authorization';

    let headerValue = '';

    if (bearer === false) {
      headerValue += '';
    } else {
      headerValue += 'Bearer ';
    }

    if (token) {
      headerValue += token;
    } else {
      headerValue += this.generatedToken;
    }

    return requester
      .post('/')
      .send({ query })
      .set(headerName, headerValue)
      .then(r => r.body);
  };
});

after(async function () {
  await User.deleteOne({
    email: this.email,
  });
});
