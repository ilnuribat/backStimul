const DataTypes = require('sequelize');

module.exports = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.UUID,
    unique: true,
  },
  createdAt: DataTypes.DATE,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ip: DataTypes.STRING,
  userAgent: DataTypes.STRING,
};
