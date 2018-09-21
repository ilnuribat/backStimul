const DataTypes = require('sequelize');

module.exports = {
  name: DataTypes.STRING,
  order: DataTypes.INTEGER,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
  },
  projectId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Project',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
};
