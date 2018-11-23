const { assert } = require('chai');
const objectService = require('../../server/src/services/object.js');
const { Group, UserGroup } = require('../../server/src/models');

describe('object', () => {
  before(async function () {
    this.tmpObject = await Group.create({
      address: {
        value: 'asdf',
      },
      type: 'OBJECT',
      name: 'test object',
    });
    this.tmpTask = await Group.create({
      objectId: this.tmpObject._id,
      name: 'test object',
      type: 'TASK'
    });
    await UserGroup.create({
      userId: this.user._id,
      groupId: this.tmpTask._id,
    });
  });
  it('deleting object deletes all tasks inside it', async function () {
    await objectService.deleteObject(null, { id: this.tmpObject._id.toString() });

    const tasks = await Group.find({ objectId: this.tmpObject._id }).lean();

    assert.isEmpty(tasks);
  });
  after(async function () {
    await UserGroup.deleteOne({ groupId: this.tmpTask._id });
    await Group.deleteOne({ _id: this.tmpObject._id });
    await Group.deleteOne({ _id: this.tmpTask._id });
  });
});

