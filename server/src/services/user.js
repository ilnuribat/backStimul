const jwt = require('jsonwebtoken');
const { Group, UserGroup, User } = require('../models');
const { JWT_SECRET } = require('../../config');

async function getTasks(userId) {
  const usersGroups = await UserGroup.find({ userId });

  return Group.find({
    _id: {
      $in: usersGroups.map(u => u.groupId),
    },
    code: null,
  });
}

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    password: user.password.slice(-10),
  }, JWT_SECRET);
}

async function searchUsers(user, regExp) {
  return User.find({
    email: regExp,
  }).lean();
}

module.exports = {
  getTasks,
  generateToken,
  searchUsers,
};
