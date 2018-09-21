const models = require('../models');
const { authenticate } = require('../../utils/auth');

const { sequelize: { Op } } = models;

module.exports = {
  ProjectGroup: {
    projectGroups: parent => models.ProjectGroup.findAll({
      where: {
        [Op.and]: [{
          parentId: parent.id,
        }, {
          id: { [Op.ne]: 1 },
        }],
      },
    }),
    projects: parent => models.Project.findAll({ where: { parentId: parent.id } }),
  },
  Query: {
    projectGroup: (parent, { id }) => models.ProjectGroup.findOne({ where: { id } }),
    projectGroups: (parent, { parentId }, ctx) => {
      authenticate(ctx);

      return models.ProjectGroup.findAll({
        where: {
          [Op.and]: [{
            parentId,
          }, {
            id: { [Op.ne]: 1 },
          }],
        },
      });
    },
  },
  Mutation: {
    createProjectGroup: (parent, args) => models.ProjectGroup.create(args),
    updateProjectGroup: (parent, args) => models.ProjectGroup.update(args, { where: { id: args.id } }),
    deleteProjectGroup: (parent, { id }) => models.ProjectGroup.destroy({ where: { id } }),
  },
};
