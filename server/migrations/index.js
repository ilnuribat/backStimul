const fs = require('fs').promises;
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const mongodb = require('mongodb');
const _ = require('lodash');
const connectDB = require('../connectDB');
const { MONGODB_HOST } = require('../config');
const { logger } = require('../logger');

const { MongoClient, Logger } = mongodb;


const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
  },
});

schema.index({ name: 1 }, { unique: true });

async function nativeConnect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGODB_HOST, {
      useNewUrlParser: true,
      // logger: msg => console.log(msg),
    }, (err, client) => {
      Logger.setLevel('debug');
      Logger.filter('class', ['Db']);

      if (err) {
        return reject(err);
      }

      return resolve(client);
    });
  });
}

const model = mongoose.model('migrations', schema);

async function migrateAll() {
  await connectDB();
  const nativeClient = await nativeConnect();
  const dirs = await fs.readdir('./server/migrations');
  let oldMigrations = await model.find();

  oldMigrations = _.map(oldMigrations, 'name');

  _.remove(dirs, d => ['index.js', '_example.js', 'createMigration.js'].includes(d));

  const diff = _.difference(dirs, oldMigrations);

  await bluebird.each(diff, async (m) => {
    /* eslint-disable import/no-dynamic-require, global-require */
    const { up } = require(`./${m}`);

    logger.info(`migrating ${m}...`);
    await up(nativeClient.db('guov'));
    logger.info('successs migration');

    // await model.create({ name: m });
  });

  await mongoose.disconnect();
  nativeClient.close();
}

migrateAll();
