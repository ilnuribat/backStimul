const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, User, Message,
} = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED,
} = require('../services/constants');
const { logger } = require('../../logger');

async function createTask(parent, { task }, { user }) {
  if (!task.objectId) {
    throw new Error('no objectId');
  }
  const foundObject = await Group.findById(task.objectId);

  if (!foundObject || foundObject.type !== 'OBJECT') {
    throw new Error('no object found');
  }
  const group = await Group.create(Object.assign(task, {
    type: 'TASK',
  }));

  await UserGroup.create({
    groupId: group.id,
    userId: user.id,
  });

  return group;
}

async function updateTask(parent, { id, task }) {
  const foundGroup = await Group.findById(id);

  if (!foundGroup || foundGroup.type !== 'TASK') {
    throw new Error('no task found');
  }
  if (task.objectId) {
    throw new Error('no ability to change objectId');
  }

  const res = await Group.updateOne({
    _id: id,
  }, {
    $set: task,
  });

  if (res.nModified) {
    const updatedTask = await Group.findById(id);

    pubsub.publish(TASK_UPDATED, { taskUpdated: updatedTask });
  }

  return res.nModified;
}

async function updateUsersTask(parent, { task }) {
  const groupId = task.id;
  const foundGroup = await Group.findById(groupId);

  if (!foundGroup) {
    return false;
  }

  const { users } = task;

  if (!Array.isArray(users) || !users.length) {
    return false;
  }

  const fullUsers = await User.find({
    _id: {
      $in: users,
    },
  });

  if (!task.delete) {
    try {
      const lastMessage = (await Message.findOne({ groupId })) || {};

      await UserGroup.insertMany(users.map(u => ({
        userId: u,
        groupId: foundGroup.id,
        lastReadCursor: lastMessage._id || ObjectId.createFromTime(0),
      })));

      fullUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
        userTaskUpdated: {
          user: u,
          task: foundGroup,
          action: 'INVITED',
        },
      }));

      return true;
    } catch (err) {
      logger.error(err);

      return false;
    }
  }

  const res = await UserGroup.deleteMany({ userId: { $in: users }, groupId: foundGroup.id });

  fullUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
    userTaskUpdated: {
      user: u,
      task: foundGroup,
      action: 'KICKED',
    },
  }));

  return !!res.n;
}

async function deleteTask(parent, { id }) {
  const res = await Group.deleteOne({ _id: id });

  return res.n;
}

async function searchTasks(user, regExp, limit = 10) {
  const res = await UserGroup.aggregate([{
    $match: {
      userId: user._id,
    },
  }, {
    $graphLookup: {
      from: 'groups',
      startWith: '$groupId',
      connectFromField: '_id',
      connectToField: '_id',
      as: 'tasks',
      restrictSearchWithMatch: {
        type: 'TASK',
      },
    },
  }, {
    $unwind: '$tasks',
  }, {
    $match: {
      'tasks.name': regExp,
    },
  }, {
    $limit: limit,
  }]);

  return res.map(r => r.tasks);
}


module.exports = {
  createTask,
  updateTask,
  updateUsersTask,
  deleteTask,
  searchTasks,
};
