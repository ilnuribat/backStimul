module.exports = {
  async up(client) {
    await client.collection('files').createIndex({
      taskId: 1,
      fileId: 1,
    }, {
      unique: true,
      name: 'taskId_fileId',
    });
  },
  async down(client) {
    return client.collection('files').dropIndex('taskId_fileId');
  },
};
