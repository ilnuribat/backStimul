const { Group } = require('../../src/models');

describe('task', () => {
  before(async function () {
    this.localObject = await Group.create({
      name: 'test obj',
      type: 'OBJECT',
    });
  });
  // TODO - test deletion task and assert that users kicked from that task
  after(async function () {
    await Group.deleteOne({ _id: this.localObject._id });
  });
});
