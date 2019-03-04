const { assert } = require('chai');
const { Group, UserGroup } = require('../src/models');

describe('approver', () => {
  before(async function () {
    this.task = await Group.create({
      name: 'test',
      type: 'TASK',
    });
  });
  after(async function () {
    await Group.deleteOne({ _id: this.task._id });
    await UserGroup.deleteMany({
      groupId: this.task._id,
    });
  });
  it('add approver', async function () {
    const { data, errors } = await this.request({
      query: `
        mutation {
          task(id: "${this.task._id.toString()}") {
            addApprover(userId: "${this.user._id.toString()}")
          }
        }
      `,
    });

    assert.isUndefined(errors);
    assert.isTrue(data.task.addApprover);
    const approvers = await UserGroup.find({
      groupId: this.task._id,
      type: 'APPROVER',
    });

    assert.lengthOf(approvers, 1);
    assert.equal(approvers[0].userId.toString(), this.user._id.toString());
  });
  describe('prepare: remove approver', () => {
    before(async function () {
      this.tmpTask = await Group.create({
        name: 'test',
        type: 'TASK',
      });
      await UserGroup.create({
        userId: this.user._id,
        groupId: this.tmpTask._id,
        type: 'APPROVER',
      });
    });
    after(async function () {
      await Group.deleteOne({ _id: this.tmpTask._id });
    });
    it('remove approver', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.tmpTask._id.toString()}") {
              removeApprover(userId: "${this.user._id.toString()}")
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isTrue(data.task.removeApprover);
      const approvers = await UserGroup.find({
        groupId: this.tmpTask._id,
        type: 'APPROVER',
      });

      assert.isEmpty(approvers);
    });
  });
});
