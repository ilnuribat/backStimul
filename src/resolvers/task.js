const moment = require('moment');
const { withFilter } = require('apollo-server');
const { Group, UserGroup } = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED, ERROR_CODES, STATUSES,
} = require('../services/constants');
const taskService = require('../services/task');
const groupService = require('../services/group');

module.exports = {
  Task: {
    id: task => task._id.toString(),
    assignedTo: groupService.assignedTo,
    lastMessage: groupService.lastMessage,
    users: groupService.getMembers,
    messages: groupService.getMessages,
    unreadCount: groupService.unreadCount,
    endDate: ({ endDate }) => (endDate ? moment(endDate).format() : null),
    parentId: ({ parentId }) => {
      if (parentId) {
        return parentId.toString();
      }

      return null;
    },
    objectId: ({ objectId }) => objectId.toString(),
    parent: (parent) => {
      if (parent.parentId) {
        return {
          id: parent.parentId.toString(),
          type: 'Task',
        };
      }

      return {
        id: parent.objectId.toString(),
        type: 'Object',
      };
    },
    tasks: parent => Group.find({
      type: 'TASK',
      parentId: parent._id,
    }),
    statuses: parent => STATUSES[parent.statusType] || STATUSES.STANDART,
  },
  Query: {
    task(parent, { id }, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return Group.findOne({ type: 'TASK', _id: id });
    },
  },
  Mutation: {
    createTask: taskService.createTask,
    updateTask: taskService.updateTask,
    deleteTask: taskService.deleteTask,
    updateUsersTask: taskService.updateUsersTask,
  },
  Subscription: {
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_UPDATED]),
        async ({ taskUpdated: { _id: _mId, id: mId } }, args, { user }) => {
          const res = await UserGroup.findOne({
            groupId: mId || _mId,
            userId: user.id,
          });

          return !!res;
        },
      ),
    },
    userTaskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_TASK_UPDATED]),
        async ({ userTaskUpdated }, args, { user }) => {
          if (user._id.equals(userTaskUpdated.user.id)) {
            return true;
          }

          const ug = await UserGroup.findOne({
            userId: user.id,
            groupId: userTaskUpdated.task.id,
          });

          return !!ug;
        },
      ),
    },
  },
};
