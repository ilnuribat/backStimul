const { assert } = require('chai');

const loginQuery = {
  query: `
    {
      user {
        id
        email
      }
    }
  `,
};

describe('user', () => {
  it('get info with token', async function () {
    const { data, errors } = await this.request({ body: loginQuery });

    assert.isUndefined(errors);
    assert.isObject(data.user);
    assert.isString(data.user.id);
    assert.isString(data.user.email);
  });

  it('try to get info with no token', async function () {
    const { data, errors } = await this.requestNoAuth({ body: loginQuery });

    assert.isNull(data.user);
    assert.isArray(errors);
    assert.equal(errors[0].message, 'not authenticated');
  });

  it('try to get info with wrong token', async function () {
    try {
      await this.requestNoAuth({
        body: loginQuery,
        headers: {
          authorization: 'Bearer asdf',
        },
      });

      throw new Error();
    } catch (err) {
      assert.isObject(err.error);
      assert.isArray(err.error.errors);
      assert.include(err.error.errors[0].message, 'invalid token');
    }
  });
});
