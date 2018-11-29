const { Group, UserGroup, User } = require('../../server/src/models');

describe.only('task', () => {
  before(async function () {
    this.localObject = await Group.create({
      name: 'test obj',
      type: 'OBJECT',
    });
  });
  it('test', async function () {
    console.log(this.localObject._id);
  });
  after(async function () {
    await Group.deleteOne({ _id: this.localObject._id });
  });
});
