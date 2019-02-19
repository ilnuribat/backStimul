const { readFileSync, readdirSync } = require('fs');
const { mergeTypes } = require('merge-graphql-schemas');

function getSchema(name) {
  return readFileSync(`${__dirname}/${name}`, { encoding: 'utf8' });
}

module.exports = mergeTypes(
  readdirSync(__dirname)
    .filter(s => s.endsWith('.graphql'))
    .map(f => getSchema(f)),
);
