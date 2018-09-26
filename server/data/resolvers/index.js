const { mergeResolvers } = require('merge-graphql-schemas');
const user = require('./user');
const group = require('./group');
const message = require('./message');

module.exports = mergeResolvers([
  user,
  group,
  message,
]);
