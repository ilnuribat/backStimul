const { assert } = require('chai');
const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, Message, User,
} = require('../src/models');
const { ERROR_CODES } = require('../src/services/constants');
const { generateToken } = require('../src/services/user');

describe('direct chat', () => {
  // создаем tmpUser, tmpUser2, directChat для user и tmpUser2
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
      type: 'DIRECT',
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
    await Group.deleteMany({
      code: {
        $in: [
          this.directCode,
          this.directChat.code,
        ],
      },
    });
  });

  describe('smoke suites', () => {
    // delete created message
    after(async function () {
      await Message.deleteMany({ groupId: this.directChat._id });
    });
    it('create direct for first time, must be created new group', async function () {
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
    it('direct chat is already exists, try to create one more time - should return same id', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            directMessage(id: "${this.tmpUser2._id.toString()}") {
              id
            }
          }
        `,
      });

      assert.isUndefined(errors);
      assert.equal(data.directMessage.id, this.directChat._id.toString());
    });
    it('create message in existing direct chat', async function () {
      const messageText = 'test message';
      const { data, errors } = await this.request({
        query: `
          mutation {
            message {
              create(message: { groupId: "${this.directChat._id.toString()}", text: "${messageText}" }) {
                id
              }
            }
          }
        `,
      });

      assert.isUndefined(errors);
      const message = await Message.findById(data.message.create.id);

      assert.equal(message.text, messageText);
    });
  });
  describe('errors', () => {
    it('try to send message without authorization', async function () {
      const { errors } = await this.request({
        query: `
          mutation {
            message {
              create(message: {groupId: "asdf", text: "asdf" }) {
                id
              }
            }
          }
        `,
        token: 'asdf',
      });

      assert.isArray(errors);
      assert.isObject(errors[0]);
      assert.equal(errors[0].message, ERROR_CODES.NOT_AUTHENTICATED);
    });
    it('try to send message to private chat of another two users', async function () {
      const token = generateToken(this.tmpUser);
      const { errors } = await this.request({
        query: `
          mutation {
            message {
              create(message: { groupId: "${this.directChat._id.toString()}", text: "not permitted"}) {
                id
              }
            }
          }
        `,
        token,
      });

      assert.isArray(errors);
      assert.isNotEmpty(errors);
      assert.equal(errors[0].message, ERROR_CODES.FORBIDDEN);
    });
    it('deprecated graphql method to create message, no authentication', async function () {
      const { errors } = await this.request({
        query: `
          mutation {
            createMessage(message: { groupId: "asdf", text: "asdf" }) {
              id
            }
          }
        `,
        token: 'asdf',
      });

      assert.isNotEmpty(errors);
      assert.equal(errors[0].message, ERROR_CODES.NOT_AUTHENTICATED);
    });
    it('send message to non-existing group', async function () {
      const { errors } = await this.request({
        query: `
          mutation {
            message {
              create(message: {
                groupId: "${ObjectId.createFromTime(Date.now())}",
                  text: "no group found"
              }) {
                id
              }
            }
          }
        `,
      });

      assert.isNotEmpty(errors);
      assert.equal(errors[0].message, ERROR_CODES.NOT_FOUND);
    });
    it('try to create direct chat with non-existing user', async function () {
      const { data, errors } = await this.request({
        query: `
          mutation {
            directMessage(id: "${ObjectId.createFromTime(Date.now())}") {
              id
              name
            }
          }
        `,
      });

      assert.isNull(data.directMessage);
      assert.isNotEmpty(errors);
      assert.equal(errors[0].message, ERROR_CODES.NO_USER_FOUND);
    });
  });
  describe('scope secuirity', () => {
    // видно двум юзерам в чате и не видно третьему
    // create two messages to direct chat
    before(async function () {
      this.textMessageMainUser = 'test message to direct chat from main user';
      this.textMessageTmpUser2 = 'test message to direct from tmpUser2';
      await Message.insertMany([{
        userId: this.user._id,
        groupId: this.directChat._id,
        text: this.textMessageMainUser,
        isDirect: true,
      }, {
        userId: this.tmpUser2._id,
        groupId: this.directChat._id,
        text: this.textMessageTmpUser2,
        isDirect: true,
      }]);
    });
    after(async function () {
      await Message.deleteMany({
        groupId: this.directChat._id,
      });
    });
    it('get messages as main user', async function () {
      const { data, errors } = await this.request({
        query: `
        {
          direct(id: "${this.directChat._id.toString()}") {
            messages {
              edges {
                node {
                  id
                  text
                }
              }
            }
          }
        }
        `,
      });

      assert.isUndefined(errors);
      assert.equal(data.direct.messages.edges[0].node.text, this.textMessageMainUser);
      assert.equal(data.direct.messages.edges[1].node.text, this.textMessageTmpUser2);
    });
    it('get messages as tmpUser2', async function () {
      const { data, errors } = await this.request({
        token: generateToken(this.tmpUser2),
        query: `
        {
          direct(id: "${this.directChat._id.toString()}") {
            messages {
              edges {
                node {
                  id
                  text
                }
              }
            }
          }
        }
        `,
      });

      assert.isUndefined(errors);
      assert.equal(data.direct.messages.edges[0].node.text, this.textMessageMainUser);
      assert.equal(data.direct.messages.edges[1].node.text, this.textMessageTmpUser2);
    });
    it('try to get messages as another user', async function () {
      const { data, errors } = await this.request({
        token: generateToken(this.tmpUser),
        query: `
        {
          direct(id: "${this.directChat._id.toString()}") {
            messages {
              edges {
                node {
                  id
                  text
                }
              }
            }
          }
        }
        `,
      });

      assert.isNotEmpty(errors);
      assert.equal(errors[0].message, ERROR_CODES.FORBIDDEN);
      assert.isNull(data.direct);
    });
  });
});

// создать юзеров, создать приватный чат
// убедиться что чат создан
// что повтороное создание вернет тот же идентификатор
// сообщение создается

// сообщение видно другому юзеру
// сообщение не видно третьим лицам
