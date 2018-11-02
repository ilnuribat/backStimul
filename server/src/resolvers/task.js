const { withFilter } = require('apollo-server');
const { Group } = require('./group');
const {
  pubsub, TASK_UPDATED, USER_TASK_UPDATED,
} = require('./chat');
const taskService = require('../services/task');

module.exports = {
  Task: Group,
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
