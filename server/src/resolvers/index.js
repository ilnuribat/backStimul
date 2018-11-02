const { mergeResolvers } = require('merge-graphql-schemas');
const user = require('./user');
const group = require('./group');
const message = require('./message');
const direct = require('./direct');
const glossary = require('./glossary');
const files = require('./files');

module.exports = mergeResolvers([
  user,
  group,
  message,
  direct,
  glossary,
  files,
]);
