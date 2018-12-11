const { TASK_STATUSES } = require('../services/constants');
const { Group } = require('../models');
const { ERROR_CODES } = require('../services/constants');

module.exports = {
  Glossary: {
    taskStatuses: () => TASK_STATUSES,
    abstractResource: async (parent, { id }) => {
      const foundGroup = await Group.findById(id);


      if (!foundGroup) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      if (foundGroup.code) {
        return 'Direct';
      }
      if (foundGroup.type === 'TASK') {
        return 'Task';
      }
      if (foundGroup.type === 'OBJECT') {
        return 'Object';
      }

      throw new Error(foundGroup.toString());
    },
  },
  Query: {
    glossary: () => ({}),
  },
};
