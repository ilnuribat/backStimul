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
  describe('update, delete', () => {
    before(async function () {
      this.task = await Group.create({
        name: 'test',
        parentId: this.parentTask._id,
        objectId: this.object._id,
        type: 'TASK',
      });
    });
    after(async function () {
      await Group.deleteOne({
        _id: this.task._id,
      });
    });
    it('update', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.task._id.toString()}") {
              update(task: {
                name: "new name"
              })
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isTrue(data.task.update);

      const task = await Group.findOne({
        _id: this.task._id,
        type: 'TASK',
      });

      assert.equal(task.name, 'new name');
    });
    it('delete', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.task._id.toString()}") {
              delete
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isTrue(data.task.delete);

      const task = await Group.findOne({
        _id: this.task._id,
        type: 'TASK',
      });

      assert.isNull(task);
    });
  });
});
