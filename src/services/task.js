const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, User, Message,
} = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED, KICKED, INVITED,
} = require('../services/constants');
const { logger } = require('../../logger');
const notificationService = require('./notification.js');


async function inviteUserToGroup({ group, user }) {
  try {
    const lastMessage = (await Message.findOne({ groupId: group._id })) || {};

    await UserGroup.create({
      userId: user._id,
      groupId: group._id,
      lastReadCursor: lastMessage._id || ObjectId.createFromTime(0),
    });

    pubsub.publish(USER_TASK_UPDATED, {
      userTaskUpdated: {
        user,
        task: group,
        action: INVITED,
      },
    });

    return true;
  } catch (err) {
    if (err.message.indexOf('duplicate') === -1) {
      logger.error(err);
      throw err;
    }

    return false;
  }
}

async function updateTask(parent, { task }, { user }) {
  const id = parent._id.toString();

  const foundTask = await Group.findOne({
    _id: id,
    type: 'TASK',
  }).lean();

  if (!foundTask) {
    throw new Error('no task found');
  }

  const userInTask = await UserGroup.findOne({
    userId: user._id,
    groupId: id,
  });

  if (!userInTask) {
    await inviteUserToGroup({ group: foundTask, user });
  }

  if (Object.keys(task).length > 1) {
    throw new Error('updating multiple fields forbidden');
  }
  const [fieldName] = Object.keys(task);

  const res = await Group.updateOne({
    _id: id,
  }, {
    $set: task,
  });

  if (res.nModified) {
    const updatedTask = await Group.findById(id);

    pubsub.publish(TASK_UPDATED, { taskUpdated: updatedTask });

    await notificationService.create({
      fieldName,
      oldValue: foundTask[fieldName],
      newValue: updatedTask[fieldName],
      operationType: 'UPDATE',
      targetType: 'TASK',
      targetId: parent._id,
      targetResourceName: foundTask.name,
      user,
    });
  }

  return res.nModified;
}

// user may be empty, in case of deleting task
async function kickUserFromGroup({ group, user }) {
  const res = await UserGroup.deleteMany({
    userId: user._id,
    groupId: group._id,
  });

  if (!res.n) {
    return false;
  }

  if (user) {
    pubsub.publish(USER_TASK_UPDATED, {
      userTaskUpdated: {
        user,
        task: group,
        action: KICKED,
      },
    });
  }

  return true;
}

async function createTask(parent, { task }, { user }) {
  const parentTask = await Group.findOne({
    _id: task.parentId,
    type: 'TASK',
  });

  if (!parentTask) {
    throw new Error('no parent task found');
  }

  const group = await Group.create(Object.assign(task, {
    type: 'TASK',
    objectId: parentTask.objectId,
  }));

  await inviteUserToGroup({ group, user });

  return group;
}

async function updateUsersTask(parent, { task }) {
  const groupId = task.id;
  const foundTask = await Group.findOne({
    _id: groupId,
    type: 'TASK',
  });

  if (!foundTask) {
    return false;
  }

  const { users } = task;

  if (users.length > 1) {
    throw new Error('no way to add more than 1 user to task');
  }

  if (!Array.isArray(users) || !users.length) {
    return false;
  }

  const taskUser = await User.findById(users[0]);

  if (!task.delete) {
    return inviteUserToGroup({ group: foundTask, user: taskUser });
  }

  return kickUserFromGroup({ group: foundTask, user: taskUser });
}

async function deleteTask(parent, args) {
  const id = parent._id.toString() || args.id;
  const task = await Group.findOne({ _id: id, type: 'TASK' }).lean();

  await kickUserFromGroup({ group: task });

  const res = await Group.deleteOne({ _id: id });

  return res.n;
}

async function searchTasks(user, regExp, limit = 10, statuses) {
  const $match = {
    'tasks.name': regExp,
  };

  if (Array.isArray(statuses) && statuses.length) {
    $match['tasks.status'] = {
      $in: statuses,
    };
  }
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
    $match,
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
  kickUserFromGroup,
  inviteUserToGroup,
};
