const models = require('./../models');
const broker = require('../../broker');

const { sequelize: { Op } } = models;

module.exports = {
  Column: {
    project: parent => models.Project.findOne({
      where: { id: parent.projectId },
    }),
    tasks: parent => broker.call('task.get', { columnId: parent.id }),
  },

  Query: {
    column: async (parent, { id }) => models.Column.findOne({ where: { id } }),
    columns: async (parent, { projectId }) => {
      const where = { [Op.and]: [] };

      if (projectId) {
        where[Op.and].push({ projectId });
      }

      return models.Column.findAll({ where });
    },
  },

  Mutation: {
    createColumn: (parent, args) => models.Column.create(args),
    updateColumn: async (parent, args) => models.Column.update(
      args,
      {
        where: { id: args.id },
      },
    ),
    deleteColumn: (parent, { id }) => models.Column.destroy({
      where: { id },
    }),
  },
};
