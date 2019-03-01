module.exports = {
  async up(client) {
    await client.collection('groups').createIndex({
      code: 1,
    }, {
      unique: true,
      name: 'group_code_idx',
      partialFilterExpression: {
        code: {
          $exists: true,
        },
      },
    });
  },
  async down(client) {
    await client.collection('groups').dropIndex('group_code_idx');
  },
};
