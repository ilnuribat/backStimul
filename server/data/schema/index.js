const { readFileSync } = require('fs');
const { mergeTypes } = require('merge-graphql-schemas');

function getSchema(name) {
  return readFileSync(`${__dirname}/${name}.graphql`, { encoding: 'utf8' });
}

const userTypes = getSchema('user');
// const projectTypes = getSchema('project');
// const columnTypes = getSchema('column');
// const taskTypes = getSchema('task');
// const projectGroupTypes = getSchema('projectGroup');
// const messageTypes = getSchema('message');
// const groupmessageTypes = getSchema('groupmessageTypes');


module.exports = mergeTypes([
  userTypes,
  // projectTypes,
  // columnTypes,
  // taskTypes,
  // projectGroupTypes,
  // messageTypes,
  // groupmessageTypes,
]);
