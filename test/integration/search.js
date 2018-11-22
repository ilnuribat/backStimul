const { assert } = require('chai');
const { search } = require('../../server/src/services/search');
const { User, Group } = require('../../server/src/models');
// const taskService = require('../../server/src/services/task');

describe('integration: search', () => {
  before(async function () {
    this.tmpEmail = 'testGrouv@gouv';
    await User.create({ email: this.tmpEmail, password: '123123' });
  });
  after(async function () {
    await User.deleteOne({ email: this.tmpEmail });
  });
  it('search User', async function () {
    const res = await search(null, { query: 'test@User.guov' }, { user: this.user });

    assert.isArray(res);
    assert.equal(res.length, 1);

    const { email, __typename } = res[0];

    assert.equal(email, this.email);
    assert.equal(__typename, 'User');
  });
  describe('search with types', () => {
    before(async function () {
      this.tmpTasks = await Group.insertMany([{
        name: 'test, task',
        type: 'TASK',
      }, {
        name: 'test',
        type: 'TASK',
      }]);
      // await UserGroup.
    });
    after(async function () {
      await Group.deleteMany({
        _id: {
          $in: this.tmpTasks.map(t => t._id),
        },
      });
    });
    it('search User with type', async () => {
      const res = await search(null, { query: 'test', type: 'USERS' }, { user: this.user });

      res.forEach((r) => {
        assert.equal(r.__typename, 'User');
      });
    });
  });
});
