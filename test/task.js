const { assert } = require('chai');
const { Group } = require('../src/models');

describe('task', () => {
  before(async function () {
    this.area = await Group.create({
      type: 'AREA',
      name: 'test',
    });
    this.object = await Group.create({
      type: 'OBJECT',
      name: 'test',
      areaId: this.area._id,
    });
    this.parentTask = await Group.create({
      type: 'TASK',
      name: 'parent task',
      parentId: null,
      objectId: this.object._id,
    });
  });
  after(async function () {
    await Group.deleteMany({
      _id: {
        $in: [
          this.parentTask._id,
          this.area._id,
          this.object._id,
        ],
      },
    });
  });
  describe('create', () => {
    after(async function () {
      await Group.deleteMany({
        parentId: this.parentTask._id,
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
                objectId
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
      assert.equal(task.objectId, this.object._id.toString());
    });
  });
});
