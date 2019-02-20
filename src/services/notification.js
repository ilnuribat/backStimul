const moment = require('moment');
const { Notification } = require('../models');
const { TASK_STATUSES_MAP } = require('../services/constants');

function generateNotificationText(args) {
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
  const notification = await Notification.create({
    text: generateNotificationText(args),
    userId: args.user._id,
    ...args,
  });

  console.log(notification);
}

module.exports = {
  create,
};

