const { Group, UserGroup, User } = require('../../server/src/models');

async function createTask({ object, users, membersCount }) {
  let obj = object;
  let members = [];

  if (!object) {
    obj = await Group.create({
      name: 'test',
      type: 'OBJECT',
    });
  }

  if (users && users.length) {
    members = users;
  }
}

module.exports = {
  createTask,
};
