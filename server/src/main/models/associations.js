module.exports = (models) => {
  // column
  models.Column.belongsTo(models.Project, {
    foreignKey: 'projectId',
  });

  // project
  models.Project.belongsTo(models.User, {
    foreignKey: 'createdBy',
  });

  models.Project.belongsToMany(models.User, {
    as: 'workers',
    through: models.ProjectUser,
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });

  models.Project.hasMany(models.Column, {
    foreignKey: 'projectId',
  });

  // user

  models.User.belongsToMany(models.Project, {
    as: 'projects',
    through: models.ProjectUser,
    foreignKey: 'userId',
  });
};
