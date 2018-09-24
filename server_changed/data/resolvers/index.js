const { mergeResolvers } = require('merge-graphql-schemas');
const userResolvers = require('./user');
// const usersResolvers = require('./users');
const projectResolvers = require('./project');
const columnResolvers = require('./column');
const taskResolvers = require('./task');
const projectGroupsResolvers = require('./projectGroup');

module.exports = mergeResolvers([
  userResolvers,
  // usersResolvers,
  projectResolvers,
  columnResolvers,
  taskResolvers,
  projectGroupsResolvers,
]);
