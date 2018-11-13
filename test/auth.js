const { assert } = require('chai');
const bcrypt = require('bcrypt');
const { User } = require('../server/src/models');

describe('login', () => {
  it('correct credentials', async function () {
    const { data, errors } = await this.requestNoAuth({
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
    const { data, errors } = await this.requestNoAuth({
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

describe('signup', () => {
  it('signup', async function () {
    this.newUserEmail = 'user@email.new';
    this.newUserPassword = '123123';

    const { data, errors } = await this.requestNoAuth({
      body: {
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
      },
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
