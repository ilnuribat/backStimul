module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Project', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      teamId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Team',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, { transaction });
    await queryInterface.createTable('ProjectUser', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'User',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      projectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Project',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, { transaction });
    await queryInterface.addIndex('ProjectUser', {
      fields: ['projectId'],
      transaction,
    });
  }),

  down: queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('ProjectUser', { transaction });
    await queryInterface.dropTable('Project', { transaction });
  }),
};
