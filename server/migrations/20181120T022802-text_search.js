module.exports = {
  async up(client) {
    const indexName = 'text_search_index';

    await client.collection('groups').createIndex({
      name: 'text',
      'address.value': 'text',
    }, {
      default_language: 'ru',
      name: indexName,
    });

    await client.collection('messages').createIndex({
      text: 'text',
    }, {
      default_language: 'ru',
      name: indexName,
    });

    await client.collection('users').createIndex({
      email: 'text',
    }, {
      default_language: 'ru',
      name: indexName,
    });
  },
  async down() {
    return null;
  },
};
