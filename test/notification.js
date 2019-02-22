const { assert } = require('chai');
const {
  Group, Notification, UserGroup, User,
} = require('../src/models');

describe('notification', () => {
  before(async function () {
    this.task = await Group.create({
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
    const text = `Пользователь "фыва" изменил поле "название" на значение "new name1"`;

    before(async function () {
      const notificationUser = await User.create({
        id1C: Math.random(),
      });

      await Notification.create({
        targetId: this.task._id,
        userId: notificationUser._id,
        text,
        targetType: 'TASK',
        operationType: 'UPDATE',
        oldValue: 'test',
        newValue: 'new name1',
        fieldName: 'name',
        watchers: [this.user._id],
      });
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

      assert.equal(notification.text, text);
      assert.isFalse(notification.isRead);
      assert.equal(notification.target.name, 'new name');
      assert.equal(notification.target.id, this.task._id.toString());
    });
  });
});
