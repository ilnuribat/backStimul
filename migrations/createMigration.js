const fs = require('fs');
const moment = require('moment');

const datetime = moment().format('YYYYMMDDThhmmss');
const name = process.argv[2] || 'name';

fs
  .createReadStream('migrations/_example.js')
  // .pipe(process.stdout)
  .pipe(fs.createWriteStream(`migrations/${datetime}-${name}.js`));
