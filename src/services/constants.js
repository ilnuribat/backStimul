const { PubSub } = require('graphql-subscriptions');
const CONSTRUCTION_TYPES = require('./assets/sections.json');

const pubsub = new PubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';
const MESSAGE_READ = 'MESSAGE_READ';
const TASK_UPDATED = 'TASK_UPDATED';
const USER_TASK_UPDATED = 'USER_TASK_UPDATED';
const KICKED = 'KICKED';
const INVITED = 'INVITED';

const GROUP_TYPES = ['DIRECT', 'TASK', 'OBJECT', 'AREA'];
const ADDRESS_LEVELS = ['region', 'area', 'city', 'settlement', 'street', 'house'];
const OBJECTS_TABS = ['PREPROJECT', 'PROJECT', 'SMR', 'PASS'];

const SU = [...Array(11).keys()]
  .map(i => i + 1)
  .map(n => ({
    id: `Строительное управление № ${n}`,
  }))
  .map(n => ({
    id: n.id,
    name: n.id,
  }));

const constructionTypeMap = CONSTRUCTION_TYPES.reduce((acc, cur) => {
  acc[cur.id] = cur;

  return acc;
}, {});

const TASK_STATUSES = [{
  id: 1,
  name: 'Новое',
}, {
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
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
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
  SU,
  constructionTypeMap,
  OBJECTS_TABS,
};
