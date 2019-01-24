const fs = require('fs');
const readline = require('readline');

async function sovle() {
  const fileStream = fs.createReadStream('list.csv');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let i = 0;

  const map = new Map();

  // eslint-disable-next-line no-restricted-syntax
  for await (const line of rl) {
    if (i === 0) {
      // i ++;
      // continue;
    }

    const splitted = line.split(';');
    const [id, fn, ln, mn, specialization,,, date, workStatus,,,,, subTeam, SU, FullOrgName] = splitted;

    const obj = {
      id, fn, ln, mn, specialization, date, workStatus, subTeam, SU, FullOrgName,
    };


    if (workStatus === 'Работает') {
      map.set(id, obj);
    } else {
      map.delete(id);
    }

    i += 1;

    if (i > 20000) {
      break;
    }
  }

  const arr = [];

  map.forEach(o => arr.push(o));

  await fs.promises.writeFile('output.json', JSON.stringify(arr));

  arr.unshift(Object.keys(arr[0]));
  const csv = arr.map(o => Object.values(o).join(';')).join('\n');

  await fs.promises.writeFile('output.csv', csv);
}

sovle();
