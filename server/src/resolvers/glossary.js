const { TASK_STATUSES } = require('../services/chat');

module.exports = {
  Glossary: {
    taskStatuses: () => TASK_STATUSES,
  },
  Query: {
    glossary: () => ({}),
  },
};
