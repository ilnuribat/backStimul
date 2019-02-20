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
const OBJECTS_TABS_NAMES = [
  { id: 'PREPROJECT', name: 'Предпроектные работы' },
  { id: 'PROJECT', name: 'Проектные работы' },
  { id: 'SMR', name: 'СМР и снабжение' },
  { id: 'PASS', name: 'Ввод в эксплуатацию' },
];

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

const STATUSES = {
  STANDART: [
    { id: 1, name: 'Новое' },
    { id: 2, name: 'В работе' },
    { id: 3, name: 'На согласовании' },
    { id: 4, name: 'Завершенное' },
  ],
  TZ: [
    { id: 5, name: 'Новое' },
    { id: 6, name: 'Получен ТТЗ' },
    { id: 7, name: 'Сформирован ТЗ' },
    { id: 8, name: 'Утврежден в ДС МО' },
  ],
  ONC: [
    { id: 9, name: 'Новое' },
    { id: 10, name: 'Согласование в РУЗКС' },
    { id: 11, name: 'Согласование в ФКП' },
    { id: 12, name: 'Согласование в ДС МО' },
    { id: 13, name: 'Получен протокол' },
  ],
  PROJECT_GK: [
    { id: 14, name: 'Новое' },
    { id: 15, name: 'Согласование в ...' },
    { id: 16, name: 'Согласновано в ГУОВ' },
    { id: 17, name: 'Подписано в ГУОВ' },
    { id: 18, name: 'Отправлено письмо в ФКП/ДС МО' },
    { id: 19, name: 'Согласновано в ДС' },
    { id: 20, name: 'Зарегистрировано' },
  ],
  KAZNA: [
    { id: 21, name: 'Новое' },
    { id: 21, name: 'Открыт счет' },
    { id: 21, name: 'Выставлен счет на аванс' },
  ],
};

const TASK_STATUSES = Object.keys(STATUSES).reduce((acc, key) => {
  acc.push(...STATUSES[key]);

  return acc;
}, []);

const TASK_STATUSES_MAP = TASK_STATUSES.reduce((acc, value) => {
  acc[value.id] = value.name;

  return acc;
}, {});

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
  STATUSES,
  OBJECTS_TABS_NAMES,
  TASK_STATUSES_MAP,
};
