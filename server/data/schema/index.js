const { readFileSync } = require('fs');
const { mergeTypes } = require('merge-graphql-schemas');

function getSchema(name) {
  return readFileSync(`${__dirname}/${name}.graphql`, { encoding: 'utf8' });
}


module.exports = mergeTypes([
  getSchema('user'),
  getSchema('group'),
]);
