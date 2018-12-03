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
  }).sort({
    lastMessageAt: 1,
  });
}

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    password: user.password.slice(-10),
  }, JWT_SECRET);
}

async function searchUsers(user, regExp, limit = 10) {
  return User.find({
    email: regExp,
  }).lean().limit(limit);
}

module.exports = {
  getTasks,
  generateToken,
  searchUsers,
};
