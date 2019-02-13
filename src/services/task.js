const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, User, Message,
} = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED, KICKED, INVITED,
} = require('../services/constants');
const { logger } = require('../../logger');


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

  await UserGroup.create({
    groupId: group.id,
    userId: user.id,
  });

  pubsub.publish(USER_TASK_UPDATED, {
    userTaskUpdated: {
      user: {
        ...user,
        id: user._id.toString(),
        username: user.email,
      },
      task: group,
      action: INVITED,
    },
  });

  return group;
}

async function updateTask(parent, { id: oldId, task }) {
  const id = (parent && parent._id.toString()) || oldId || task.id;

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

async function kickUsersFromGroup({ group, users }) {
  const res = await UserGroup.deleteMany({
    userId: {
      $in: users.map(u => u._id),
    },
    groupId: group._id,
  });

  users.map(u => pubsub.publish(USER_TASK_UPDATED, {
    userTaskUpdated: {
      user: {
        id: u._id.toString(),
        username: u.email,
        ...u,
      },
      task: group,
      action: KICKED,
    },
  }));

  return !!res.n;
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

  const taskUsers = await User.find({
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

      taskUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
        userTaskUpdated: {
          user: {
            id: u._id.toString(),
            username: u.email,
            ...u,
          },
          task: foundGroup,
          action: INVITED,
        },
      }));

      return true;
    } catch (err) {
      logger.error(err);

      return false;
    }
  }

  return kickUsersFromGroup({ group: foundGroup, users: taskUsers });
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
};
