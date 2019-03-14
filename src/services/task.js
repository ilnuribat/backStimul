const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, User, Message,
} = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED, KICKED, INVITED, STATUSES
} = require('../services/constants');
const { logger } = require('../../logger');
const notyMe = require('./Notify.js');


async function inviteUserToGroup({ group, user }) {
  try {
    const lastMessage = (await Message.findOne({ groupId: group._id })) || {};

    await UserGroup.create({
      userId: user._id,
      groupId: group._id,
      lastReadCursor: lastMessage._id || ObjectId.createFromTime(0),
      type: 'CHAT',
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
  const dataForNotify = {};

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
    type: 'CHAT',
  });

  if (!userInTask) {
    await inviteUserToGroup({ group: foundTask, user });
  }

  const fields = () => ({
    name: 'Название',
    status: 'Статус',
    assignedTo: 'Ответственный',
    endDate: 'Дата завершения',
  });

  dataForNotify.groupId = id;
  dataForNotify.entityId = id;
  dataForNotify.notyId = id;
  dataForNotify.parentId = id;
  dataForNotify.userId = user._id;
  dataForNotify.name = foundTask.name;
  dataForNotify.events = [];

  Object.keys(task).forEach(async (element) => {
    let oldparam = foundTask[element];
    let newparam = task[element];

    if (element === 'assignedTo') {
      const oldu = await User.findById(oldparam, 'fullName initials -_id');
      const newu = await User.findById(newparam, 'fullName initials -_id');

      oldparam = oldu && oldu.initials && oldu.initials;
      newparam = newu && newu.initials && newu.initials;
    }
    if (element === 'status') {
      const statuses = STATUSES[parent.statusType] || STATUSES.STANDART;
      const oldi = statuses && statuses.find(x => x.id && x.id.toString() === oldparam.toString());
      const newi = statuses && statuses.find(x => x.id && x.id.toString() === newparam.toString());

      oldparam = oldi && oldi.name && oldi.name;
      newparam = newi && newi.name && newi.name;
    }

    // eslint-disable-next-line max-len
    dataForNotify.events.push({ date: new Date(), text: `${user.initials} изменил ${fields()[element]} с "${oldparam || foundTask[element] || 'Не указано'}" на "${newparam || task[element] || 'Неизвестно'}"` });
  });

  const res = await Group.updateOne({
    _id: id,
  }, {
    $set: task,
  });

  if (res.nModified) {
    const updatedTask = await Group.findById(id);

    pubsub.publish(TASK_UPDATED, { taskUpdated: updatedTask });
    notyMe.makeNotify(dataForNotify);
  }

  return res.nModified;
}

// user may be empty, in case of deleting task
async function kickUserFromGroup({ group, user = {} }) {
  const res = await UserGroup.deleteOne({
    userId: user._id,
    groupId: group._id,
    type: 'CHAT',
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
    // TODO search in all tasks
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
