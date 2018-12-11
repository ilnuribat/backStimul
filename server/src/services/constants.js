const { PubSub } = require('graphql-subscriptions');


const pubsub = new PubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';
const MESSAGE_READ = 'MESSAGE_READ';
const TASK_UPDATED = 'TASK_UPDATED';
const USER_TASK_UPDATED = 'USER_TASK_UPDATED';
const KICKED = 'KICKED';
const INVITED = 'INVITED';

const GROUP_TYPES = ['DIRECT', 'TASK', 'OBJECT'];
const ADDRESS_LEVELS = ['region', 'area', 'city', 'settlement', 'street', 'house'];

const TASK_STATUSES = [{
  id: 1,
  name: 'Новое',
}, {
//   id: 2,
//   name: 'Неназначенное',
// }, {
  id: 3,
  name: 'В работе',
}, {
  id: 4,
  name: 'На согласовании',
}, {
  id: 5,
  name: 'Завершенное',
}];

const ERROR_CODES = {
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NO_USER_FOUND: 'NO_USER_FOUND',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
};

module.exports = {
  pubsub,
  MESSAGE_ADDED,
  MESSAGE_READ,
  TASK_UPDATED,
  USER_TASK_UPDATED,
  GROUP_TYPES,
  ADDRESS_LEVELS,
  TASK_STATUSES,
  KICKED,
  INVITED,
  ERROR_CODES,
};
