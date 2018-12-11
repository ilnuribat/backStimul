const { TASK_STATUSES } = require('../services/constants');
const { Group } = require('../models');

module.exports = {
  Glossary: {
    taskStatuses: () => TASK_STATUSES,
    abstractResource: async (parent, { id }) => {
      const foundGroup = await Group.findById(id);


      if (!foundGroup) {
        throw new Error('not found any resource with such id');
      }

      if (foundGroup.code) {
        return 'Direct';
      }
      if (foundGroup.type === 'TASK') {
        return 'Task';
      }
      if (foundGroup.type === 'OBJECTS') {
        return 'Object';
      }

      throw new Error(foundGroup.toString());
    },
  },
  Query: {
    glossary: () => ({}),
  },
};
