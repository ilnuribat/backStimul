const DataTypes = require('sequelize');

module.exports = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ProjectGroup',
    },
  },
};
