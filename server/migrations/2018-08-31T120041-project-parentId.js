module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.sequelize.query('DELETE FROM "Project";', { transaction });
    await queryInterface.addColumn('Project', 'parentId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ProjectGroup',
      },
      allowNull: false,
      onDelete: 'CASCADE',
      upUpdate: 'CASCADE',
    }, { transaction });
    await queryInterface.changeColumn('Project', 'teamId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction });
  }),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('Project', 'parentId', { transaction });
    await queryInterface.changeColumn('Project', 'teamId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, { transaction });
  }),
};
