const { search } = require('../services/search');


module.exports = {
  SearchType: {
    tasks: (parent, args, ctx) => search(null, { type: 'TASKS', ...ctx.args }, ctx),
    users: (parent, args, ctx) => search(null, { type: 'USERS', ...ctx.args }, ctx),
    objects: (parent, args, ctx) => search(null, { type: 'OBJECTS', ...ctx.args }, ctx),
    messages: (parent, args, ctx) => search(null, { type: 'MESSAGES', ...ctx.args }, ctx),
  },
  Query: {
    search,
    previewSearch: async (parent, args, ctx) => {
      ctx.args = args;

      return {};
    },
  },
  SearchResult: {
    __resolveType: ({ __typename }) => __typename,
  },
};
