const mongoose = require('mongoose');
const { assert } = require('chai');
const objectService = require('../../src/services/object.js');
const { Group, UserGroup } = require('../../src/models');

describe('object', () => {
  beforeEach(async function () {
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
      type: 'TASK',
    });
    await UserGroup.create({
      userId: this.user._id,
      groupId: this.tmpTask._id,
      type: 'CHAT',
    });
  });
  it('deleting object deletes all tasks inside it', async function () {
    await objectService.deleteObject(null, { id: this.tmpObject._id.toString() });

    const tasks = await Group.find({ objectId: this.tmpObject._id }).lean();

    assert.isEmpty(tasks);
  });
  it('delete notFound object', async () => {
    try {
      await objectService.deleteObject(null, { id: mongoose.Types.ObjectId.createFromTime(Date.now()) });
      throw new Error('asdf');
    } catch (err) {
      assert.equal(err.message, 'no object found to delete');
    }
  });

  afterEach(async function () {
    await UserGroup.deleteOne({ groupId: this.tmpTask._id });
    await Group.deleteOne({ _id: this.tmpObject._id });
    await Group.deleteOne({ _id: this.tmpTask._id });
  });
});
