const statuses = [{
  id: 1,
  name: 'Новое',
}, {
  id: 2,
  name: 'Не назначенное',
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

module.exports = {
  Glossary: {
    taskStatuses: () => statuses,
  },
  Query: {
    glossary: () => ({}),
  },
};
