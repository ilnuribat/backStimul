const { assert } = require('chai');
const { subscriptionConnectHandler } = require('../index');
const { generateToken } = require('../src/services/user');
const { ERROR_CODES } = require('../src/services/constants');

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
          generateToken({ id1C: '' })
        }`,
      });

      throw new Error();
    } catch (err) {
      assert.include(err.message, ERROR_CODES.NOT_AUTHENTICATED);
    }
  });
});
