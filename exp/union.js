/* eslint-disable no-underscore-dangle */
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');
const { logger } = require('../logger.js');

fetch('http://localhost:8500/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(result => result.json())
  .then((result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );

    // eslint-disable-next-line no-param-reassign
    result.data.__schema.types = filteredData;
    fs.writeFile('./fragmentTypes.json', JSON.stringify(result.data), (err) => {
      if (err) {
        logger.error('Error writing fragmentTypes file', err);
      } else {
        logger.info('Fragment types successfully extracted!');
      }
    });
  });
