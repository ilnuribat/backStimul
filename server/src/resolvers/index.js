const { mergeResolvers } = require('merge-graphql-schemas');
const user = require('./user');
const group = require('./group');
const message = require('./message');
const direct = require('./direct');
const glossary = require('./glossary');
const files = require('./files');
const object = require('./object');
const task = require('./task');
const search = require('./search');

module.exports = mergeResolvers([
  user,
  group,
  message,
  direct,
  glossary,
  files,
  object,
  task,
  search,
]);
