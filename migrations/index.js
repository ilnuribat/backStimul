const fs = require('fs').promises;
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const mongodb = require('mongodb');
const _ = require('lodash');
const { MONGODB_HOST, MONGO_DATABASE } = require('../config');
const { logger } = require('../logger');
const { connect, disconnect } = require('../connectDB.js');

const { MongoClient, Logger } = mongodb;

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
  },
});

schema.index({ name: 1 }, { unique: true });

async function nativeConnect() {
  await connect({ pg: false });

  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGODB_HOST, {
      useNewUrlParser: true,
    }, (err, client) => {
      Logger.setLevel('debug');
      Logger.filter('class', ['Db']);

      if (err) {
        logger.error('error!', err);

        return reject(err);
      }
      logger.info('connected to database');
      process.on('exit', () => client.close());

      return resolve(client);
    });
  });
}

const migrationModel = mongoose.model('migrations', schema);

async function migrateAll(nativeClient) {
  const dirs = await fs.readdir('./migrations');
  let oldMigrations = await migrationModel.find().lean();

  oldMigrations = _.map(oldMigrations, 'name');

  _.remove(dirs, d => !d.endsWith('.js')
    || ['index.js', '_example.js', 'createMigration.js'].includes(d));

  const diff = _.difference(dirs, oldMigrations);

  await bluebird.each(diff, async (m) => {
    /* eslint-disable import/no-dynamic-require, global-require */
    const { up } = require(`./${m}`);

    logger.info(`migrating ${m}...`);
    await up(nativeClient);
    logger.info('successs migration');

    await migrationModel.create({ name: m });
  });
}

async function undoMigration(nativeClient) {
  // get last migration
  const [lastMigration] = await migrationModel.find({}).sort({ _id: -1 }).limit(1);

  // execute down function
  const executeScript = require(`./${lastMigration.name}`);

  await executeScript.down(nativeClient);
  await nativeClient.collection('migrations').deleteOne({ _id: lastMigration._id });
}

// migrateAll();

async function handleMigration() {
  const last = process.argv[process.argv.length - 1];

  const nativeClient = await nativeConnect();


  if (last === '--down') {
    await undoMigration(nativeClient.db(MONGO_DATABASE));
  } else {
    await migrateAll(nativeClient.db(MONGO_DATABASE));
  }

  await disconnect();
  await nativeClient.close();
  process.exit();
}

handleMigration();
