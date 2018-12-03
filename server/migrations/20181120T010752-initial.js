const { Schemas } = require('../src/models');


module.exports = {
  async up() {
    await Schemas.Files.index({
      taskId: 1,
      fileId: 1,
    }, {
      unique: true,
    });
    await Schemas.Group.index({ code: 1 }, {
      unique: true,
      partialFilterExpression: {
        code: {
          $exists: true,
        },
      },
    });
    await Schemas.User.index({ email: 1 }, { unique: true });
    await Schemas.UserGroup.index({ userId: 1, groupId: 1 }, { unique: true });
  },
  async down() {
    await Schemas.Group.findOne();
  },
};
