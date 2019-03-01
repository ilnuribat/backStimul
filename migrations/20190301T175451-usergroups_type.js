module.exports = {
  async up(client) {
    await client.collection('usergroups').createIndex({
      userId: 1,
      groupId: 1,
      type: 1,
    }, {
      unique: true,
      name: 'userid_groupid_type',
    });
  },
  async down(client) {
    await client.collection('usersgroups').dropIndex('userid_groupid_type');
  },
};
