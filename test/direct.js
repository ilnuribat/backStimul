const { assert } = require('chai');
const {
  Group, UserGroup, Message, User,
} = require('../server/src/models');

describe('direct', () => {
  before(async function () {
    this.groupChat = await Group.create({
      type: 'TASK',
    });
    await UserGroup.create({
      userId: this.user._id,
      groupId: this.groupChat._id,
    });
  });
  after(async function () {
    await UserGroup.deleteMany({
      groupId: this.groupChat._id,
    });
    await Message.deleteMany({
      groupId: {
        $in: [
          this.groupChat._id,
        ],
      },
    });
    await Group.deleteMany({
      _id: {
        $in: [
          this.groupChat._id,
        ],
      },
    });
  });
  it('create message, in group chat', async function () {
    const text = 'test group chat';
    const { data, errors } = await this.request({
      query: `
        mutation {
          createMessage(message: {
            groupId: "${this.groupChat._id.toString()}"
            text: "${text}"
          }) {
            id
          }
        }
      `,
    });

    assert.isUndefined(errors);

    const message = await Message.findById(data.createMessage.id).lean();

    assert.equal(message.text, text);
  });
  describe.only('direct chat', () => {
    before(async function () {
      this.tmpUser = await User.create({
        email: 'tmpDirectUser',
      });
      this.tmpUser2 = await User.create({
        email: 'tmpDirectUser2',
      });
      this.directChat = await Group.create({
        code: [this.user._id.toString(), this.tmpUser2._id.toString()].sort().join('|'),
        name: 'test',
      });
      await UserGroup.insertMany([{
        userId: this.user._id,
        groupId: this.directChat._id,
      }, {
        userId: this.tmpUser2._id,
        groupId: this.directChat._id,
      }]);
      this.directCode = [this.user._id.toString(), this.tmpUser._id.toString()].sort().join('|');
    });
    after(async function () {
      await User.deleteMany({
        _id: {
          $in: [
            this.tmpUser._id,
            this.tmpUser2._id,
          ],
        },
      });
      await UserGroup.deleteMany({
        userId: {
          $in: [
            this.user._id,
            this.tmpUser._id,
            this.tmpUser2._id,
          ],
        },
      });
      await Group.deleteOne({
        code: {
          $in: [
            this.directCode,
            this.directChat.code,
          ],
        },
      });
    });

    it('create direct', async function () {
      const { data, errors } = await this.request({
        query: `mutation {
          directMessage(id: "${this.tmpUser._id.toString()}") {
            id
            name
          }
        }`,
      });

      assert.isUndefined(errors);
      const directData = await Group.findById(data.directMessage.id);

      assert.equal(this.directCode, directData.code);
    });
  });
});
// создать юзеров, создать приватный чат
// убедиться что чат создан

// что повтороное создание вернет тот же идентификатор
// сообщение создается
// сообщение видно другому юзеру
// lastMessage подгружается

