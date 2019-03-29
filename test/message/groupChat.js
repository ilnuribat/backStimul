const { assert } = require('chai');
const { Group, UserGroup, Message } = require('../../src/models');

describe('message', () => {
  before(async function () {
    this.groupChat = await Group.create({
      type: 'TASK',
      name: 'groupChat',
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
  describe('get message with all fields', () => {
    before(async function () {
      await Message.create({
        isDirect: false,
        userId: this.user._id,
        groupId: this.groupChat._id,
        text: 'message created in before case',
      });
    });
    after(async function () {
      await Message.deleteMany({ groupId: this.groupChat._id });
    });
    it('get all fields', async function () {
      const { data, errors } = await this.request({
        query: `
        {
          task(id: "${this.groupChat._id.toString()}") {
            messages {
              edges {
                node {
                  id
                  text
                  createdAt
                  isRead
                  from {
                    id
                    initials
                  }
                  to {
                    __typename
                    ... on Task {
                      id
                      name
                    }
                    ... on Direct {
                      id
                    }
                  }
                }
              }
            }
          }
        }
        `,
      });

      assert.isUndefined(errors);
      const { task: { messages: { edges } } } = data;

      assert.isArray(edges);
      const lastMessage = edges[edges.length - 1].node;

      assert.equal(lastMessage.from.id, this.user._id.toString());
      assert.equal(lastMessage.from.initials, this.user.initials);
      assert.equal(lastMessage.to.__typename, 'Task');
      assert.equal(lastMessage.to.id, this.groupChat._id.toString());
      assert.equal(lastMessage.to.name, 'groupChat');
    });
  });
});
