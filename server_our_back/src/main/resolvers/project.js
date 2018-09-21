const _ = require('lodash');
const models = require('./../models');

const { sequelize: { Op } } = models;

module.exports = {
  Project: {
    creator: parent => models.User.findOne({
      where: { id: parent.createdBy },
    }),
    columns: parent => models.Column.findAll({
      where: { projectId: parent.id },
    }),
  },

  Query: {
    project: (parent, { id }) => models.Project.findOne({ where: { id } }),
    projects: async (parent, { userId, parentId }) => {
      const where = { [Op.and]: [] };

      if (userId) {
        const projectUsers = await models.ProjectUser.findAll({ where: { userId } });

        where[Op.and].push({ id: { [Op.in]: _.map(projectUsers, 'projectId') } });
      }

      if (parentId) {
        where[Op.and].push({ parentId });
      }

      return models.Project.findAll({ where });
    },
  },

  Mutation: {
    createProject: async (parent, args) => {
      try {
        const project = await models.sequelize.transaction(async (transaction) => {
          const newProject = await models.Project.create(args, { transaction });

          await models.ProjectUser.create({
            userId: args.createdBy,
            projectId: newProject.id,
          }, { transaction });
          await models.Column.create({ projectId: newProject.id, name: 'To Do', order: 0 },
            { transaction });

          return newProject;
        });

        return project;
      } catch (err) {
        throw new Error(`createProject: ${err.message}`);
      }
    },
    updateProject: async (parent, args) => models.Project.update(
      args, { where: { id: args.id } },
    ),
    deleteProject: (parent, { id }) => models.Project.destroy({
      where: { id },
    }),
  },
};
