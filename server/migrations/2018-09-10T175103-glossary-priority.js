module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    const schema = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    };

    await queryInterface.createTable('GlossaryPriority', schema, { transaction });
    const { sequelize } = queryInterface;
    const model = sequelize.define('GlossaryPriority', schema, {
      freezeTableName: true,
      timestamps: false,
    });

    await model.bulkCreate([
      { name: 'Наивысший' },
      { name: 'Высокий' },
      { name: 'Обычный' },
      { name: 'Низкий' },
      { name: 'Наинизший' },
    ], { transaction });
  }),

  down: queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('GlossaryPriority', { transaction });
  }),
};
