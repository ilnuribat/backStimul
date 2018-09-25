const { mergeResolvers } = require('merge-graphql-schemas');
const userResolvers = require('./user');
const groupResolvers = require('./group');

module.exports = mergeResolvers([
  userResolvers,
  groupResolvers,
]);
