const {
  TASK_STATUSES, ERROR_CODES, SU, STATUSES,
} = require('../services/constants');
const { Group } = require('../models');
const constructionTypes = require('../services/assets/sections.json');

module.exports = {
  Glossary: {
    taskStatuses: () => TASK_STATUSES,
    defaultStatuses: () => STATUSES.STANDART,
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
    SU: () => SU,
    constructionTypes: () => constructionTypes,
  },
  Query: {
    glossary: () => ({}),
  },
};
