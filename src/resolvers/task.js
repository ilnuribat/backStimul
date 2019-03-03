const moment = require('moment');
const { withFilter } = require('apollo-server');
const { Group, User, UserGroup } = require('../models');
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
    approvers: async (parent) => {
      const ugs = await UserGroup.find({
        groupId: parent._id,
        type: 'APPROVER',
      });

      const approvers = await User.find({
        _id: {
          $in: ugs.map(ug => ug.userId),
        },
      });

      return approvers.map(a => ({
        user: a,
        comment: 'asdf',
        decision: 'NONE',
      }));
    },
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
    addApprover: async (parent, { userId }) => {
      if (!parent) {
        throw new Error('taskId is required');
      }
      const approver = await User.findById(userId);

      if (!approver) {
        throw new Error('no approver found');
      }

      await UserGroup.insertOne({
        groupId: parent._id,
        userId,
        type: 'APPROVER',
      });
      // TODO add notification about it
    },
    removeApprover: async (parent, { userId }) => {
      if (!parent) {
        throw new Error('taskId is required');
      }
      const approver = await UserGroup.findOne({
        userId,
        groupId: parent._id,
        type: 'APPROVER',
      });

      if (!approver) {
        throw new Error('no approver found to remove');
      }

      await UserGroup.deleteOne({
        userId,
        groupId: parent._id,
        type: 'APPROVER',
      });
      // TODO add notification
    },
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
  },
};
