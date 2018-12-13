const { assert } = require('chai');
const bcrypt = require('bcrypt');
const { Types: { ObjectId } } = require('mongoose');
const { User } = require('../server/src/models');
const { subscriptionConnectHandler } = require('../server');
const { generateToken } = require('../server/src/services/user');
const { ERROR_CODES } = require('../server/src/services/constants');

describe.only('login', () => {
  it('correct credentials', async function () {
    const { data, errors } = await this.request({
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
    });

    console.log(errors);
    assert.isUndefined(errors, 'empty errors');

    const { login } = data;

    assert.isObject(login);
    assert.isString(login.token);
  });
  it('no Authorization header', async function () {
    await this.request({
      noAuthorization: true,
      query: `{
        user {
          id
        }
      }`,
    });
  });
  it('wrong credentials', async function () {
    const { data, errors } = await this.request({
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
    });

    assert.isNull(data.login);
    assert.isArray(errors);
    assert.equal(errors[0].message, 'password is incorrect');
  });
});

describe('signup', () => {
  it('signup', async function () {
    this.newUserEmail = 'user@email.new';
    this.newUserPassword = '123123';

    const { data, errors } = await this.request({
      query: `
          mutation {
            signup(user: {
              email: "${this.newUserEmail}"
              password: "${this.newUserPassword}"
            }) {
              id
              token
            }
          }
        `,
    });

    assert.isUndefined(errors);
    assert.isObject(data.signup);
    assert.isString(data.signup.id);
    assert.isString(data.signup.token);

    const user = await User.findOne({ email: this.newUserEmail });

    assert.isObject(user);
    assert.equal(user.email, this.newUserEmail);
    const isCorrectPassword = await bcrypt.compare(this.newUserPassword, user.password);

    assert.isTrue(isCorrectPassword);
  });
  after(async function () {
    await User.deleteOne({
      email: this.newUserEmail,
    });
  });
});

describe('subscription onConnect', () => {
  it('good credentials', async function () {
    const context = await subscriptionConnectHandler({
      Authorization: `Bearer ${this.generatedToken}`,
    });

    assert.isObject(context);
    assert.isObject(context.user);
    assert.equal(context.user.id, this.user.id);
  });
  it('no bearer', async () => {
    try {
      await subscriptionConnectHandler({ Authorization: '' });

      throw new Error();
    } catch (err) {
      assert.equal(err.message, 'its not bearer');
    }
  });
  it('invalid jwt', async () => {
    try {
      await subscriptionConnectHandler({ Authorization: 'Bearer asdf;klj' });

      throw new Error();
    } catch (err) {
      assert.include(err.message, 'jwt');
    }
  });
  it('no user found', async () => {
    try {
      await subscriptionConnectHandler({
        Authorization: `Bearer ${
          generateToken({
            id: ObjectId.createFromTime(0),
            password: '1',
          })
        }`,
      });

      throw new Error();
    } catch (err) {
      assert.include(err.message, ERROR_CODES.NO_USER_FOUND);
    }
  });
});
