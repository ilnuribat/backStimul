const { assert } = require('chai');
const { search } = require('../../src/services/search');
const {
  User,
  Group,
  UserGroup,
  Message,
} = require('../../src/models');
const { directMessage } = require('../../src/services/chat');

describe('integration: search', () => {
  before(async function () {
    this.tmpUser = await User.create({
      email: 'testGrouv@gouv',
      id1C: Math.random(),
    });
  });
  after(async function () {
    await User.deleteOne({ _id: this.tmpUser._id });
  });
  it('search with special characters', async function () {
    const res = await search(null, { query: 'test \\sdfфыва !\\ @#$%^&*&*)(' }, { user: this.user });

    assert.isArray(res);
  });
  it('search User', async function () {
    const res = await search(null, { query: 'test@User.guov' }, { user: this.user });

    assert.isArray(res);
    assert.isAtLeast(res.length, 1);
    assert.include(res.map(r => r.email), this.user.email);
  });
  it('search with wrong type', async function () {
    const res = await search(null, { query: 'test', type: 'wrong' }, { user: this.user });

    assert.isEmpty(res);
  });
  describe('search with types', () => {
    before(async function () {
      this.areas = await Group.insertMany([{
        name: 'test area 1',
        type: 'AREA',
        address: {
          value: 'test addresss',
        },
      }, {
        name: 'some area',
        type: 'AREA',
        address: {
          value: 'some test',
        },
      }]);
      this.objects = await Group.insertMany([{
        name: 'test object',
        type: 'OBJECT',
      }, {
        name: 'some test',
        type: 'OBJECT',
      }]);
      this.tmpTasks = await Group.insertMany([{
        name: 'test, task',
        objectId: this.objects[0]._id,
        type: 'TASK',
      }, {
        name: 'test',
        objectId: this.objects[1]._id,
        type: 'TASK',
      }]);
      await UserGroup.insertMany([{
        userId: this.user._id,
        groupId: this.tmpTasks[0]._id,
        type: 'CHAT',
      }, {
        userId: this.user._id,
        groupId: this.tmpTasks[1]._id,
        type: 'CHAT',
      }]);
      this.tmpDirect = await directMessage(null, { id: this.tmpUser._id.toString() }, { user: this.user });

      await Message.insertMany([{
        text: 'test message to task chat',
        userId: this.user._id,
        groupId: this.tmpTasks[0]._id,
        isDirect: false,
      }, {
        text: 'test message to direct chat',
        userId: this.user._id,
        groupId: this.tmpDirect._id,
        isDirect: true,
      }]);
    });
    after(async function () {
      await Group.deleteMany({
        _id: {
          $in: this.tmpTasks.map(t => t._id),
        },
      });
      await UserGroup.deleteMany({
        groupId: {
          $in: [...this.tmpTasks.map(t => t._id), this.tmpDirect._id],
        },
      });
      await Group.deleteMany({
        _id: {
          $in: this.objects.map(o => o._id),
        },
      });
      await Group.deleteMany({
        _id: {
          $in: this.areas.map(a => a._id),
        },
      });
      await Group.deleteOne({ _id: this.tmpDirect._id });
      await Message.deleteMany({
        groupId: {
          $in: [this.tmpTasks[0]._id, this.tmpDirect._id],
        },
      });
    });
    const types = ['USERS', 'TASKS', 'OBJECTS', 'MESSAGES', 'AREAS'];

    types.forEach((type) => {
      it(`search ${type} with type`, async function () {
        const res = await search(null, { query: 'test', type }, { user: this.user });

        assert.isAtLeast(res.length, 2, type);

        res.forEach((r) => {
          assert.equal(`${r.__typename.toUpperCase()}S`, type);
        });
      });
    });
    it('search without type selected, all type returned', async function () {
      const res = await search(null, { query: 'test' }, { user: this.user });

      types.forEach((type) => {
        const typeRes = res.filter(r => `${r.__typename.toUpperCase()}S` === type);

        assert.isNotEmpty(typeRes);
        assert.isAtLeast(typeRes.length, 2);
      });
    });
  });
});
