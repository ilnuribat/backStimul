const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, User, Message,
} = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED, KICKED, INVITED,
} = require('../services/constants');
const { logger } = require('../../logger');
const notificationService = require('./notification.js');


async function updateTask(parent, { task }, { user }) {
  const id = parent._id.toString();

  const foundTask = await Group.findOne({
    _id: id,
    type: 'TASK',
  });

  if (!foundTask) {
    throw new Error('no task found');
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
      user,
    });
  }

  return res.nModified;
}

async function kickUsersFromGroup({ group, users }) {
  const res = await UserGroup.deleteMany({
    userId: {
      $in: users.map(u => u._id),
    },
    groupId: group._id,
  });

  if (!res.n) {
    return false;
  }

  users.map(user => pubsub.publish(USER_TASK_UPDATED, {
    userTaskUpdated: {
      user,
      task: group,
      action: KICKED,
    },
  }));

  return true;
}

// users - массив объектов из юзеров
async function inviteUsersToGroup({ group, users = [] }) {
  try {
    const lastMessage = (await Message.findOne({ groupId: group._id })) || {};

    await UserGroup.insertMany(users.map(u => ({
      userId: u,
      groupId: group.id,
      lastReadCursor: lastMessage._id || ObjectId.createFromTime(0),
    })));

    users.map(user => pubsub.publish(USER_TASK_UPDATED, {
      userTaskUpdated: {
        user,
        task: group,
        action: INVITED,
      },
    }));

    return true;
  } catch (err) {
    if (err.message.indexOf('duplicate') === -1) {
      logger.error(err);
      throw err;
    }

    return false;
  }
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

  await inviteUsersToGroup({ group, users: [user] });

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

  if (!Array.isArray(users) || !users.length) {
    return false;
  }

  const taskUsers = await User.find({
    _id: {
      $in: users,
    },
  });

  if (!task.delete) {
    return inviteUsersToGroup({ group: foundTask, users: taskUsers });
  }

  return kickUsersFromGroup({ group: foundTask, users: taskUsers });
}

async function deleteTask(parent, args) {
  const id = parent._id.toString() || args.id;
  const userGroups = await UserGroup.find({ groupId: id });
  const users = await User.find({
    _id: {
      $in: userGroups.map(ug => ug.userId),
    },
  });
  const task = await Group.findOne({ _id: id, type: 'TASK' }).lean();


  await kickUsersFromGroup({ group: task, users });

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
  kickUsersFromGroup,
  inviteUsersToGroup,
};
