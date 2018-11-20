const models = require('../src/models');

module.exports = {
  async up() {
    await models.User.findOne();
  },
  async down() {
    await models.Group.findOne();
  },
};
