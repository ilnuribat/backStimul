const bluebird = require('bluebird');
const { Group, UserGroup } = require('../models');
const { logger } = require('../../logger');
const objectTasksTemplate = require('./temlates/objectTasks');
const {
  pubsub, OBJECT_CREATED, OBJECT_UPDATED, OBJECT_DELETED,
} = require('./constants.js');

async function searchObjects(user, regExp, limit) {
  const res = await Group.find({
    type: 'OBJECT',
    name: regExp,
  }).limit(limit).lean();

  return res;
}

async function deleteObject(parent, args) {
  const id = parent ? parent._id : args.id;

  logger.debug('deleting object with id', { parent, args, id });
  const foundObject = await Group.findById(id);

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

  const res = await Group.deleteOne({ _id: id });

  logger.debug('deleted object', res);

  if (res.n) {
    pubsub.publish(OBJECT_DELETED, {
      objectDeleted: foundObject,
    });
  }

  return res.n;
}

async function createObject(parent, { object }) {
  const res = await Group.create({
    ...object,
    type: 'OBJECT',
  });

  async function createTemplateTasks({ parentId, tasks }) {
    if (!tasks) {
      return null;
    }

    return bluebird.each(tasks, async (task) => {
      const createdTask = await Group.create({
        type: 'TASK',
        objectId: res._id,
        parentId,
        ...task,
      });

      return createTemplateTasks({ parentId: createdTask._id, tasks: task.tasks });
    });
  }

  await createTemplateTasks({ parentId: null, tasks: objectTasksTemplate.allTasks });

  pubsub.publish(OBJECT_CREATED, {
    objectCreated: res,
  });

  return res;
}

async function updateObject({ _id }, { object }) {
  const res = await Group.updateOne({
    _id,
    type: 'OBJECT',
  }, {
    $set: object,
  });

  if (res.nModified) {
    const updatedObject = await Group.findById(_id);

    pubsub.publish(OBJECT_UPDATED, {
      objectUpdated: updatedObject,
    });
  }

  return res.nModified;
}

module.exports = {
  searchObjects,
  deleteObject,
  createObject,
  updateObject,
};
