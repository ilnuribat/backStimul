const models = require('../src/main/models');

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('ProjectGroup', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER,
      },
    }, { transaction });
    await models.User.create({
      id: 1,
      email: 'test',
      password: '123',
    }, { transaction });
    await models.ProjectGroup.create({
      id: 1,
      name: 'root',
      createdBy: 1,
      parentId: 1,
    }, { transaction });
    await queryInterface.changeColumn('ProjectGroup', 'parentId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ProjectGroup',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: true,
    }, { transaction });
  }),

  down: queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await models.User.destroy({ where: { id: 1 } }, { transaction });
    await queryInterface.dropTable('ProjectGroup', { transaction });
  }),
};
