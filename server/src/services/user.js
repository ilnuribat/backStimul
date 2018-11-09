const { Group, UserGroup } = require('../models');

async function getTasks(userId) {
  const usersGroups = await UserGroup.find({ userId });

  return Group.find({
    _id: {
      $in: usersGroups.map(u => u.groupId),
    },
    code: null,
  });
}

module.exports = {
  getTasks,
};
