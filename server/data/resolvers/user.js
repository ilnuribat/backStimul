const _ = require('lodash');
const models = require('./../models');

const { sequelize: { Op } } = models;

module.exports = {
  User: {
    projects: async (parent) => {
      const userProjects = await models.ProjectUser.findAll({ where: { userId: parent.id } });

      return models.Project.findAll({
        where: {
          id: {
            [Op.in]: _.map(userProjects, 'projectId'),
          },
        },
      });
    },
  },

  Query: {
    user: (parent, { id }) => models.User.findOne({ where: { id } }),
    users: async () => {
      const where = { [Op.and]: [] };

      return models.User.findAll({ where });
    },
  },

  Mutation: {
    updateUser: async (parent, args) => models.User.update(
      args,
      {
        where: { id: args.id },
      },
    ),
  },
};
