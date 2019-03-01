module.exports = {
  async up(client) {
    await client.collection('users');
  },
  async down(client) {
    await client.collection('users');
  },
};
