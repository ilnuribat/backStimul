const { readFileSync, writeFileSync } = require('fs');
const moment = require('moment');

const example = readFileSync('./migrations/_example.migration', { encoding: 'utf8' });
const date = moment().format('YYYY-MM-DDTHHmmss');


writeFileSync(`./migrations/${date}-unnamed-migration.js`, example);
