module.exports = {
  async up(client) {
    await client.collection('users').createIndex({
      id1C: 1,
    }, {
      unique: true,
      name: 'users_id1C',
    });
  },
  async down(client) {
    await client.collection('users').dropIndex('users_id1C');
  },
};
