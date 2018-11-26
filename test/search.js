const { assert } = require('chai');

describe('search', () => {
  describe('user', () => {
    it('exactly', async function () {
      const { data, errors } = await this.request({
        query: `{
          search(query: "${this.email}") {
            users {
              id
              email
            }
          }
        }`,
      });

      assert.isUndefined(errors);
      assert.isObject(data);
      assert.isArray(data.search.users);
      assert.equal(data.search.users.length, 1);
      assert.equal(data.search.users[0].id, this.user.id);
    });
  });
});
