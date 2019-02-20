const moment = require('moment');
const { Notification, User, UserGroup } = require('../models');
const { TASK_STATUSES_MAP } = require('../services/constants');

async function generateNotificationText(args) {
  const {
    newValue,
    user,
    targetResourceName,
    fieldName,
  } = args;

  let humanFieldName;
  let humanNewValue;

  switch (fieldName) {
    case 'endDate':
      humanFieldName = 'Срок';
      humanNewValue = moment(newValue).format();
      break;
    case 'name':
      humanFieldName = 'Название';
      break;
    case 'status':
      humanFieldName = 'Статус';
      humanNewValue = TASK_STATUSES_MAP[newValue];
      break;
    case 'assignedTo': {
      const assignedToUser = await User.findById(newValue);

      if (!assignedToUser) {
        throw new Error('cant set assignedTo, no user found');
      }

      humanFieldName = 'Ответственный';
      humanNewValue = assignedToUser.initials;

      break;
    }
    default:
      break;
  }

  return `Пользователь ${
    user.initials
  } в задаче "${
    targetResourceName
  }" изменил поле "${
    humanFieldName || fieldName
  }" на значение "${
    humanNewValue || newValue
  }"`;
}

async function create(args) {
  const text = await generateNotificationText(args);
  const watchers = await UserGroup.find({
    groupId: args.targetId,
  });
  const notification = await Notification.create({
    text,
    userId: args.user._id,
    watchers: watchers.map(w => w.userId),
    ...args,
  });

  console.log(notification);
}

module.exports = {
  create,
};

