const { TASK_STATUSES } = require('./chat');

module.exports = {
  Glossary: {
    taskStatuses: () => TASK_STATUSES,
  },
  Query: {
    glossary: () => ({}),
  },
};
