module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.sequelize.query('create extension if not exists "uuid-ossp"', { transaction });
    await queryInterface.createTable('Session', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      ip: Sequelize.STRING,
      userAgent: Sequelize.STRING,
    }, { transaction });
  }),

  down: queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('Session', { transaction });
  }),
};
