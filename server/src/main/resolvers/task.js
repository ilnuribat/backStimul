const { Column, User } = require('./../models');
const broker = require('../../broker');

const { authenticate } = require('../../utils/auth');

module.exports = {
  Task: {
    column: parent => Column.findOne({
      where: { id: parent.columnId },
    }),
    creator: parent => User.findOne({
      where: { id: parent.createdBy },
    }),
  },

  Query: {
    task: async (parent, { id }, ctx) => {
      authenticate(ctx);

      return broker.call('task.getOne', { id });
    },
    tasks: async (parent, { columnId }, ctx) => {
      authenticate(ctx);

      return broker.call('task.get', { columnId });
    },

  },

  Mutation: {
    createTask: async (parent, { input }, ctx) => {
      authenticate(ctx);

      return broker.call('task.create', input);
    },
    updateTask: async (parent, args, ctx) => {
      authenticate(ctx);

      const { id, input } = args;

      return broker.call('task.update', { id, input });
    },
    deleteTask: async (parent, { id }, ctx) => {
      authenticate(ctx);

      return broker.call('task.deleteOne', { id });
    },
  },
};
