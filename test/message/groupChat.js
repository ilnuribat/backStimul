const { assert } = require('chai');
const { Group, UserGroup, Message } = require('../../src/models');

describe('message', () => {
  before(async function () {
    this.groupChat = await Group.create({
      type: 'TASK',
    });
    await UserGroup.create({
      userId: this.user._id,
      groupId: this.groupChat._id,
      type: 'CHAT',
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
});
