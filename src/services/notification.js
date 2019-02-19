const { Notification } = require('../models');

async function create(args) {
  const {
    user,
    targetType,
    operationType,
    targetId,
  } = args;

  console.log(args);

  const notification = await Notification.create({
    userId: user._id,
    targetType,
    operationType,
    targetId,
    text: 'asdf',
  });

  console.log(notification);
}

module.exports = {
  create,
};

