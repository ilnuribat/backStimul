const { assert } = require('chai');
const { Group, UserGroup, Message, User } = require('../server/src/models');

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
        email: 'tmpDirectUser'
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
      
      console.log(data, errors);
      const ids = [this..user._id.toString(), this.tmpUser._id.toString()].sort();

      console.log(ids);
    });
    after(async function () {
      await User.deleteOne({ _id: this.tmpUser._id });
      await UserGroup.deleteMany({
        userId: {
          $in: [
            this.user._id.toString(),
            this.tmpUser._id.toString(),
          ],
        },
      });
    });
  });
});
    // создать юзеров, создать приватный чат
    // убедиться что чат создан
    // что повтороное создание вернет тот же идентификатор
    // сообщение создается
    // сообщение видно другому юзеру
    // lastMessage подгружается
 
