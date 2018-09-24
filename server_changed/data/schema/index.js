const { readFileSync } = require('fs');
const { mergeTypes } = require('merge-graphql-schemas');

const settings = { encoding: 'utf8' };

const userTypes = readFileSync(`${__dirname}/user.graphql`, settings);
// const usersTypes = readFileSync(`${__dirname}/users.graphql`, settings);
const projectTypes = readFileSync(`${__dirname}/project.graphql`, settings);
const columnTypes = readFileSync(`${__dirname}/column.graphql`, settings);
const taskTypes = readFileSync(`${__dirname}/task.graphql`, settings);
const projectGroupTypes = readFileSync(`${__dirname}/projectGroup.graphql`, settings);
const glossaryTypes = readFileSync(`${__dirname}/glossary.graphql`, settings);
const messageTypes = readFileSync(`${__dirname}/message.graphql`, settings);
const groupmessageTypes = readFileSync(`${__dirname}/groupmessageTypes.graphql`, settings);


module.exports = mergeTypes([
  userTypes,
  // usersTypes,
  projectTypes,
  columnTypes,
  taskTypes,
  projectGroupTypes,
  glossaryTypes,
  messageTypes,
  groupmessageTypes,
]);
