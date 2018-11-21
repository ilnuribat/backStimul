const { searchMessages } = require('../services/chat');
const { searchObjects } = require('../services/object');
const { searchTasks } = require('../services/task');
const { searchUsers } = require('../services/user');

module.exports = {
  Query: {
    async search(parent, { query, type }, { user }) {
      let result = [];
      const words = query.split(/\s/);
      const regExQuery = new RegExp(words.join('|'), 'i');

      switch (type) {
        case 'MESSAGES':
          result = await searchMessages(user, regExQuery);

          return result.map(m => ({
            __typename: 'Message',
            ...m,
          }));
        case 'OBJECTS':
          result = await searchObjects(user, regExQuery);

          return result.map(r => ({
            __typename: 'Object',
            ...r,
          }));
        case 'TASKS':
          result = await searchTasks(user, regExQuery);

          return result.map(t => ({
            __typename: 'Task',
            ...t,
          }));
        case 'USERS':
          result = await searchUsers(user, regExQuery);

          return result.map(u => ({
            __typename: 'User',
            ...u,
          }));
        default:
          break;
      }

      return result;
    },
    async previewSearch(parent, { query, limit = 3 }, { user }) {
      const words = query.split(/\s/);
      const regExQuery = new RegExp(words.join('|'), 'i');
      const [users, tasks, objects, messages] = await Promise.all([
        searchUsers(user, regExQuery, limit),
        searchTasks(user, regExQuery, limit),
        searchObjects(user, regExQuery, limit),
        searchMessages(user, regExQuery, limit),
      ]);

      console.log({
        users,
        tasks,
        objects,
        messages,
      });

      return {
        users,
        tasks,
        objects,
        messages,
      };
    },
  },
  SearchResult: {
    __resolveType: ({ __typename }) => __typename,
  },
};
