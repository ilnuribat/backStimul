const { searchMessages } = require('../services/chat');
const { searchObjects } = require('../services/object');
const { searchTasks } = require('../services/task');
const { searchUsers } = require('../services/user');
const { searchFiles } = require('../services/files');

async function search(parent, {
  query, type, limit = 10, statuses,
}, { user }) {
  const result = [];
  let tempRes;
  const words = query.replace(/[^a-zа-яё0-9\ ]/ig, ' ').split(' ').filter(s => s.length);
  const regExQuery = new RegExp(words.join('|'), 'i');

  if (type) {
    switch (type) {
      case 'MESSAGES':
        tempRes = await searchMessages(user, regExQuery, limit);

        result.push(...tempRes.map(m => ({
          __typename: 'Message',
          ...m,
        })));
        break;
      case 'OBJECTS':
        tempRes = await searchObjects(user, regExQuery, limit);

        result.push(...tempRes.map(r => ({
          __typename: 'Object',
          ...r,
        })));
        break;
      case 'TASKS':
        tempRes = await searchTasks(user, regExQuery, limit, statuses);

        result.push(...tempRes.map(t => ({
          __typename: 'Task',
          ...t,
        })));
        break;
      case 'USERS':
        tempRes = await searchUsers(user, regExQuery, limit);

        result.push(...tempRes.map(u => ({
          __typename: 'User',
          ...u,
        })));
        break;
      case 'FILES':
        tempRes = await searchFiles(user, regExQuery, limit);

        result.push(...tempRes.map(f => ({
          __typename: 'File',
          ...f,
        })));
        break;
      default:
        break;
    }
  } else {
    const [users, tasks, objects, messages, files] = await Promise.all([
      searchUsers(user, regExQuery, limit),
      searchTasks(user, regExQuery, limit),
      searchObjects(user, regExQuery, limit),
      searchMessages(user, regExQuery, limit),
      searchFiles(user, regExQuery, limit),
    ]);

    return [
      ...users.map(u => ({
        __typename: 'User',
        ...u,
      })),
      ...tasks.map(t => ({
        __typename: 'Task',
        ...t,
      })),
      ...objects.map(o => ({
        __typename: 'Object',
        ...o,
      })),
      ...messages.map(m => ({
        __typename: 'Message',
        ...m,
      })),
      ...files.map(f => ({
        __typename: 'File',
        ...f,
      })),
    ];
  }

  return result;
}


module.exports = {
  search,
};
