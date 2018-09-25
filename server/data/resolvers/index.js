const { mergeResolvers } = require('merge-graphql-schemas');
const userResolvers = require('./user');
// const projectResolvers = require('./project');
// const columnResolvers = require('./column');
// const taskResolvers = require('./task');
// const projectGroupsResolvers = require('./projectGroup');

module.exports = mergeResolvers([
  userResolvers,
  // projectResolvers,
  // columnResolvers,
  // taskResolvers,
  // projectGroupsResolvers,
]);
