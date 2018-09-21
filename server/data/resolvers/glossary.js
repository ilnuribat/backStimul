const models = require('../models');

module.exports = {
  Glossary: {
    priorities: () => models.GlossaryPriority.findAll(),
  },
  Query: {
    glossary: () => true, // hack
  },
};
