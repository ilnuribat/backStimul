const { search } = require('../services/search');


module.exports = {
  SearchType: {
    tasks: (parent, args, ctx) => search(null, { type: 'TASKS', ...ctx.args, ...args }, ctx),
    users: (parent, args, ctx) => search(null, { type: 'USERS', ...ctx.args }, ctx),
    objects: (parent, args, ctx) => search(null, { type: 'OBJECTS', ...ctx.args }, ctx),
    messages: (parent, args, ctx) => search(null, { type: 'MESSAGES', ...ctx.args }, ctx),
    files: (parent, args, ctx) => search(null, { type: 'FILES', ...ctx.args }, ctx),
    areas: (parent, args, ctx) => search(null, { type: 'AREAS', ...ctx.args }, ctx),
  },
  Query: {
    search: async (parent, args, ctx) => {
      ctx.args = args;

      return {};
    },
  },
};
