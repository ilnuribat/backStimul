const request = require('request-promise-native');
const { assert } = require('chai');
const { User } = require('../server/src/models');
const connectDB = require('../server/connectDB');

describe('login', () => {
  before(async function () {
    this.email = 'test@User.guov';
    this.password = '123123';

    await connectDB();
    await User.create({
      email: this.email,
      password: this.password,
    });
  });
  after(async function () {
    await User.deleteOne({
      email: this.email,
    });
  });
  it('correct credentials', async function () {
    const { data, errors } = await request
      .post('http://localhost:8500/', {
        headers: {
          'content-type': 'application/json',
        },
        json: true,
        body: {
          query: `
          mutation {
            login(user: {
              email: "${this.email}"
              password: "${this.password}"
            }) {
              id
              token
            }
          }
        `,
        },
      });

    assert.isUndefined(errors, 'empty errors');
    const { login } = data;

    assert.isObject(login);
    assert.isString(login.token);
  });
  it('wrong credentials', async function () {
    const { data, errors } = await request
      .post('http://localhost:8500/', {
        headers: {
          'content-type': 'application/json',
        },
        json: true,
        body: {
          query: `
          mutation {
            login(user: {
              email: "${this.email}"
              password: "any password!"
            }) {
              id
              token
            }
          }
        `,
        },
      });

    assert.isNull(data.login);
    assert.isArray(errors);
    assert.equal(errors[0].message, 'password is incorrect');
  });
});
