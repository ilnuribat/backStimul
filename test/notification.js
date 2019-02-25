const { assert } = require('chai');
const {
  Group, Notification, UserGroup, User,
} = require('../src/models');
const { TASK_STATUSES_MAP } = require('../src/services/constants.js');

describe('notification', () => {
  before(async function () {
    this.task = await Group.create({
      name: 'test',
      type: 'TASK',
    });
  });
  beforeEach(async function () {
    await Group.updateOne({
      _id: this.task._id,
    }, {
      name: 'test',
      type: 'TASK',
    });
  });
  after(async function () {
    await UserGroup.deleteMany({ groupId: this.task._id });
    await Group.deleteMany({
      _id: {
        $in: [
          this.task._id,
        ],
      },
    });
  });
  afterEach(async function () {
    await Notification.deleteMany({ targetId: this.task._id });
  });
  it('updating task will create notification', async function () {
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
    const notification = await Notification.findOne({
      targetId: this.task._id,
    });

    assert.isNotNull(notification);
    assert.isString(notification.text);
    assert.equal(notification.targetId.toString(), this.task._id.toString());
    assert.equal(notification.userId.toString(), this.user._id.toString());
    assert.equal(notification.oldValue, 'test');
    assert.equal(notification.newValue, 'new name');
    assert.equal(notification.fieldName, 'name');
  });
  describe('user has notifications', () => {
    const text = 'Пользователь "фыва" изменил поле "название" на значение "new name1"';

    before(async function () {
      this.notificationUser = await User.create({
        id1C: Math.random(),
      });

      await Notification.create({
        targetId: this.task._id,
        userId: this.notificationUser._id,
        text,
        targetType: 'TASK',
        operationType: 'UPDATE',
        oldValue: 'test',
        newValue: 'new name1',
        fieldName: 'name',
        watchers: [this.user._id],
      });
    });
    after(async function () {
      await User.deleteOne({ _id: this.notificationUser._id });
    });
    it('get notification with all fields', async function () {
      const { data, errors } = await this.request({
        query: `
          {
            user {
              notifications(limit: 10) {
                nodes {
                  text
                  target {
                    ... on Task {
                      id
                      name
                    }
                  }
                  isRead
                  date
                }
              }
            }
          }
        `,
      });

      assert.isUndefined(errors);
      const notification = data.user.notifications.nodes[0];
      const task = await Group.findById(this.task._id);

      assert.equal(notification.text, text);
      assert.isFalse(notification.isRead);
      assert.equal(notification.target.name, task.name);
      assert.equal(notification.target.id, this.task._id.toString());
    });
  });
  describe('update fields of tasks', async () => {
    afterEach(async function () {
      await Notification.deleteMany({
        targetId: this.task._id,
      });
    });
    // change name
    it('change name', async function () {
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
      const notification = await Notification.findOne({
        targetId: this.task._id,
      }).lean();

      assert.isNotNull(notification);
      assert.include(notification.text, 'new name');
      assert.include(notification.text, 'Название');
    });
    // chane status
    it('change status', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.task._id}") {
              update(task: {
                status: 2,
              })
            }
          }
        `,
      });

      assert.isTrue(data.task.update);
      assert.isUndefined(errors);

      const notification = await Notification.findOne({
        targetId: this.task._id,
      }).lean();

      assert.isNotNull(notification);
      assert.include(notification.text, TASK_STATUSES_MAP[2]);
      assert.include(notification.text, 'Статус');
    });
    // change assignedTo
    it('change assignedTo', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.task._id.toString()}") {
              update(task: {
                assignedTo: "${this.user._id.toString()}"
              })
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isTrue(data.task.update);

      const notification = await Notification.findOne({
        targetId: this.task._id.toString(),
      }).lean();

      assert.isNotNull(notification);
      assert.include(notification.text, this.user.initials);
      assert.include(notification.text, 'Ответственный');
    });
    // change endDate
    it('change endDate', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.task._id.toString()}") {
              update(task: {
                endDate: "2019-01-01"
              })
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isTrue(data.task.update);

      const notification = await Notification.findOne({
        targetId: this.task._id,
      }).lean();

      assert.isNotNull(notification);
      assert.include(notification.text, 'Срок');
    });
    // update fields should generate only one notification
    it('update field should generate only one notification', async function () {
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
      const notifications = await Notification.find({
        targetId: this.task._id,
      });

      assert.lengthOf(notifications, 1);
    });
    // updating same task with same field`s value won't generate notification
    it('update task with same value wont create notification', async function () {
      const task = await Group.findById(this.task._id);
      const { data, errors } = await this.request({
        query: `
          mutation {
            task(id: "${this.task._id.toString()}") {
              update(task: {
                name: "${task.name}"
              })
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.isFalse(data.task.update);

      const notification = await Notification.findOne({
        targetId: this.task._id,
      });

      assert.isNull(notification);
    });
  });
});
