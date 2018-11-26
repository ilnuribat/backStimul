const { assert } = require('chai');

const query = `
  {
    user {
      id
      email
      username
    }
  }
`;

describe('user', () => {
  it('get info with token', async function () {
    const { data, errors } = await this.request({ query, token: '' });

    assert.isUndefined(errors);
    assert.isObject(data.user);
    assert.isString(data.user.id);
    assert.isString(data.user.email);
    assert.isString(data.user.username);
    assert.equal(data.user.email, data.user.username);
  });

  it('try to get info with no token', async function () {
    const { data, errors } = await this.request({ query, bearer: false });

    assert.isNull(data.user);
    assert.isArray(errors);
    assert.equal(errors[0].message, 'not authenticated');
  });

  it('try to get info with wrong token', async function () {
    const { data, errors } = await this.request({ query, token: 'fasdf' });

    assert.isUndefined(data);
    assert.isArray(errors);
    assert.include(errors[0].message, 'invalid token');
  });
});
