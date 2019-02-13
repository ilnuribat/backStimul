const { assert } = require('chai');
const { Group } = require('../src/models');

describe.only('task', () => {
  describe('create', () => {
    before(async function () {
      this.parentTask = await Group.create({
        type: 'TASK',
        name: 'parent task',
      });
    });
    after(async function () {
      await Group.deleteMany({
        _id: {
          $in: [
            this.parentTask._id,
          ],
        },
      });
    });
    it('new graphql method', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task {
              create(task: {
                name: "test task"
                parentId: "${this.parentTask._id.toString()}"
              }) {
                id
                name
              }
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isString(data.task.create.id);

      const task = await Group.findOne({
        _id: data.task.create.id,
        type: 'TASK',
      });

      assert.isNotNull(task);
      assert.equal(task.name, 'test task');
    });
  });
});
