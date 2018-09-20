module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Column', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,

      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.literal('NOW()'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.literal('NOW()'),
        allowNull: false,
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Project',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, { transaction });
  }),

  down: queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('Column', { transaction });
  }),
};
