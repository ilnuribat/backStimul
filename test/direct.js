const { assert } = require('chai');
const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, Message, User,
} = require('../server/src/models');
const { ERROR_CODES } = require('../server/src/services/constants');
const { generateToken } = require('../server/src/services/user');

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
  describe('direct chat', () => {
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
      await Message.deleteMany({
        groupId: {
          $in: [
            this.directChat._id,
          ],
        },
      });
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
                create(message: { groupId: "${ObjectId.createFromTime(Date.now())}", text: "no group found" }) {
                  id
                }
              }
            }
          `,
        });

        assert.isNotEmpty(errors);
        assert.equal(errors[0].message, ERROR_CODES.NOT_FOUND);
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

