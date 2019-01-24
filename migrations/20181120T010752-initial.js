const { Schemas } = require('../src/models');


module.exports = {
  async up(client) {
    await client.collection('files').createIndex({
      taskId: 1,
      fileId: 1,
    }, {
      unique: true,
      name: 'taskId_fileId',
    });
    await client.collection('groups').createIndex({
      code: 1,
    }, {
      name: 'code_unique',
      unique: true,
      partialFilterExpression: {
        code: {
          $exists: true,
        },
      },
    });
    await client.collection('users').createIndex({
      email: 1,
    }, {
      unique: true,
    });
    await client.collection('usergroups').createIndex({
      userId: 1,
      groupId: 1,
    }, {
      unique: true,
    });
  },
  async down() {
    await Schemas.Group.findOne();
  },
};
