const moment = require('moment');
const { withFilter } = require('apollo-server');
const { Group } = require('../models');
const {
  pubsub,
  TASK_UPDATED,
  USER_TASK_UPDATED,
  ERROR_CODES,
  STATUSES,
  TASK_CREATED,
  TASK_DELETED,
} = require('../services/constants');
const taskService = require('../services/task');
const groupService = require('../services/group');
const approverService = require('../services/approver.js');

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
    approvers: parent => approverService.getApprovers(parent),
  },
  Query: {
    task(parent, { id }, { user }) {
      if (!id) {
        throw new Error('id is required');
      }
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return Group.findOne({ type: 'TASK', _id: id });
    },
  },
  TaskMutations: {
    create: taskService.createTask,
    update: taskService.updateTask,
    delete: taskService.deleteTask,
    addApprover: (parent, { userId }) => approverService.addApprover(parent, userId),
    removeApprover: (parent, { userId }) => approverService.removeApprover(parent, userId),
    approve: (parent, { comment }, { user }) => approverService.makeDecision({
      task: parent, user, comment, decision: 'APPROVED',
    }),
    decline: (parent, { comment }, { user }) => approverService.makeDecision({
      task: parent, user, comment, decision: 'DECLINED',
    }),
  },
  Mutation: {
    task: async (parent, args, { user }) => {
      const { id } = args;

      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      if (!id) {
        return {};
      }

      return Group.findOne({
        _id: id,
        type: 'TASK',
      }).lean();
    },
    updateUsersTask: taskService.updateUsersTask,
  },
  Subscription: {
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_UPDATED]),
        async () => true,
      ),
    },
    userTaskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_TASK_UPDATED]),
        async () => true,
      ),
    },
    taskCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_CREATED]),
        () => true,
      ),
    },
    taskDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_DELETED]),
        () => true,
      ),
    },
  },
};
