const { withFilter } = require('apollo-server');
const { Group } = require('../models');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED,
} = require('../services/constants');
const taskService = require('../services/task');
const groupService = require('../services/group');

module.exports = {
  Task: {
    async users(parent) {
      return groupService.getMembers(parent);
    },
  },
  Query: {
    task(parent, { id }) {
      return Group.findOne({ code: null, _id: id });
    },
  },
  Mutation: {
    createTask: taskService.createTask,
    updateTask: taskService.updateTask,
    updateUsersGroup: taskService.updateUsersGroup,
    deleteTask: taskService.deleteTask,
  },
  Subscription: {
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_UPDATED]),
        ({ taskUpdated: { _id: mId } }, { id }) => mId.toString() === id,
      ),
    },
    userTaskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_TASK_UPDATED]),
        () => true,
      ),
    },
  },
};
