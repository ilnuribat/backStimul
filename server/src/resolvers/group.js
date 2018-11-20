const moment = require('moment');
const { Group } = require('../models');
const taskService = require('../services/task');
const groupService = require('../services/group');

module.exports = {
  Group: {
    assignedTo: groupService.assignedTo,
    lastMessage: groupService.lastMessage,
    users: groupService.getMembers,
    messages: groupService.getMessages,
    unreadCount: groupService.unreadCount,
    endDate: ({ endDate }) => (endDate ? moment(endDate).format() : null),
  },
  Query: {
    groups: () => Group.find({ code: null }),
    group: (parent, { id }) => Group.findOne({ _id: id, code: null }),
  },
  Mutation: {
    createGroup(parent, { group: task }, ctx) {
      return taskService.createTask(parent, { task }, ctx);
    },
    updateGroup(parent, { id, group: task }) {
      return taskService.updateTask(parent, { id, task });
    },
    deleteGroup(parent, { id }) {
      return taskService.deleteTask(parent, { id });
    },
    updateUsersGroup(parent, { group }) {
      return taskService.updateUsersGroup(parent, { task: group });
    },
  },
};
