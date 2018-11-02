const { Types: { ObjectId } } = require('mongoose');
const {
  Group, UserGroup, User, Message,
} = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED,
} = require('../resolvers/chat');

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

  const res = await Group.update({
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

async function updateUsersGroup(parent, { group }) {
  const groupId = group.id;
  const foundGroup = await Group.findById(groupId);

  if (!foundGroup) {
    return false;
  }

  const { users } = group;

  if (!Array.isArray(users) || !users.length) {
    return false;
  }

  const fullUsers = await User.find({
    _id: {
      $in: users,
    },
  });

  if (!group.delete) {
    try {
      const lastMessage = (await Message.findOne({ groupId })) || {};

      await UserGroup.insertMany(users.map(u => ({
        userId: u,
        groupId: foundGroup.id,
        lastReadCursor: lastMessage._id || ObjectId.createFromTime(0),
      })));

      fullUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
        userTaskUpdated: {
          user: {
            id: u.id,
            username: u.username,
            email: u.email,
          },
          action: 'INVITED',
        },
      }));

      return true;
    } catch (err) {
      return false;
    }
  }

  const res = await UserGroup.deleteMany({ userId: { $in: users }, groupId: foundGroup.id });

  fullUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
    userTaskUpdated: {
      user: {
        id: u.id,
        username: u.username,
        email: u.email,
      },
      action: 'KICKED',
    },
  }));

  return !!res.n;
}

async function deleteTask(parent, { id }) {
  const res = await Group.deleteOne({ _id: id });

  return res.n;
}


module.exports = {
  createTask,
  updateTask,
  updateUsersGroup,
  deleteTask,
};
