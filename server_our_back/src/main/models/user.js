const DataTypes = require('sequelize');

module.exports = {
  username: {
    unique: true,
    type: DataTypes.STRING,
  },
  email: {
    unique: true,
    type: DataTypes.STRING,
  },
  password: DataTypes.STRING,
};
