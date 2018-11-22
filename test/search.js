const { assert } = require('chai');

describe('search', () => {
  describe('user', () => {
    it('exactly', async function () {
      const { data, errors } = await this.request({
        query: `{
          search(query: "${this.email}", type: USERS) {
            ... on User {
              id
              email
            }
          }
        }`,
      });

      assert.isUndefined(errors);
      assert.isObject(data);
      assert.isArray(data.search);
      assert.equal(data.search.length, 1);
      assert.equal(data.search[0].id, this.user.id);
    });
  });
});
