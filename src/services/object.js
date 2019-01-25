const { Group, UserGroup } = require('../models');
const { logger } = require('../../logger');

async function searchObjects(user, regExp, limit) {
  const res = await Group.find({
    type: 'OBJECT',
    name: regExp,
  }).limit(limit).lean();

  return res;
}

async function deleteObject(parent) {
  logger.debug('deleting object with id', { parent });
  const foundObject = await Group.findById(parent._id);

  if (!foundObject) {
    throw new Error('no object found to delete');
  }

  const tasks = await Group.find({
    type: 'TASK',
    objectId: foundObject._id,
  });

  const ugRes = await UserGroup.deleteMany({
    groupId: {
      $in: tasks.map(t => t._id),
    },
  });

  logger.debug('deleted userGroups', ugRes);

  const tasksRes = await Group.deleteMany({
    type: 'TASK',
    objectId: foundObject._id,
  });

  logger.debug('deleted inner tasks', tasksRes);

  const res = await Group.deleteOne({ _id: parent._id });

  logger.debug('deleted object', res);

  return res.n;
}

async function createObject(parent, { object }) {
  if (!object.areaId) {
    throw new Error('no areaId');
  }
  if (!object.name) {
    throw new Error('no name');
  }
  const res = await Group.create({
    ...object,
    type: 'OBJECT',
  });

  return res;
}

async function updateObject({ id }, { object }) {
  const res = await Group.updateOne({
    _id: id,
    type: 'OBJECT',
  }, {
    $set: object,
  });

  return res.nModified;
}


module.exports = {
  searchObjects,
  deleteObject,
  createObject,
  updateObject,
};
