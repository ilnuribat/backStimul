module.exports = {
  up: async queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('TeamUser', { transaction });
    await queryInterface.removeColumn('Project', 'teamId', { transaction });
    await queryInterface.dropTable('Team', { transaction });
  }),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Team', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('NOW()'),

      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('NOW()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      website: {
        type: Sequelize.STRING,
      },
      companyName: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, { transaction });
    await queryInterface.createTable('TeamUser', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'User',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      teamId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Team',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, { transaction });
    await queryInterface.addIndex('TeamUser', {
      fields: ['teamId'],
      transaction,
    });
    await queryInterface.sequelize.query('INSERT INTO "Team"(id, name, "createdBy") VALUES(1, \'1\', 1)', { transaction });
    await queryInterface.addColumn('Project', 'teamId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Team',
      },
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      defaultValue: 1,
    }, { transaction });
    await queryInterface.changeColumn('Project', 'teamId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, { transaction });
  }),
};
