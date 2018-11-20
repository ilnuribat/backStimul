const fs = require('fs').promises;
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const _ = require('lodash');
const connectDB = require('../connectDB');

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});

const model = mongoose.model('migrations', schema);

async function migrateAll() {
  await connectDB();
  const dirs = await fs.readdir('./server/migrations');
  let oldMigrations = await model.find();

  oldMigrations = _.map(oldMigrations, 'name');

  _.remove(dirs, d => ['index.js', '_example.js', 'createMigration.js'].includes(d));

  const diff = _.difference(dirs, oldMigrations);

  await bluebird.each(diff, async (m) => {
    /* eslint-disable import/no-dynamic-require, global-require */
    const { up } = require(`./${m}`);

    await up();

    await model.create({ name: m });
  });

  await mongoose.disconnect();
}

migrateAll();
