const fs = require('fs');
const readline = require('readline');
const moment = require('moment');
const { User } = require('../src/models');
const { connect } = require('../connectDB');
const { logger } = require('../logger.js');

async function sovle() {
  await connect();

  const fileStream = fs.createReadStream(`${__dirname}/list.csv`);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let i = 0;
  const step = 100;

  console.time(step);
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of rl) {
    const splitted = line.split(';').map(s => s.trim());
    const [
      id1C,
      firstName,
      lastName,
      middleName,
      specialization,,,
      birthdate,
      workStatus,,,,,,,
      FullOrgName,
    ] = splitted;

    const OU = FullOrgName.split('/').reduce((acc, curr) => {
      if (curr.length < 10) {
        acc[acc.length - 1] = `${acc[acc.length - 1]}/${curr}`;
      } else {
        acc.push(curr);
      }

      return acc;
    }, []);

    const obj = {
      id1C,
      firstName,
      lastName,
      middleName,
      initials: `${lastName} ${firstName[0]}.${middleName[0]}.`,
      fullName: `${lastName} ${firstName} ${middleName}`,
      specialization,
      birthdate: moment(birthdate.split('.').reverse().join('-')).format(),
      isWorking: workStatus === 'Работает',
      OU,
    };

    let user = await User.findOne({ id1C });

    if (!user) {
      user = await User.create(obj);
    } else {
      await User.updateOne({ id1C }, { $set: obj });
    }

    i += 1;
    if (i % step === 0) {
      console.timeEnd(step);
      console.time(step);
    }

    // break;
  }
  logger.info('finish');
}

sovle();
