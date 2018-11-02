const { TASK_STATUSES } = require('../services/constants');

module.exports = {
  Glossary: {
    taskStatuses: () => TASK_STATUSES,
  },
  Query: {
    glossary: () => ({}),
  },
};
