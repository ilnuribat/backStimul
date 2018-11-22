const { search } = require('../services/search');

module.exports = {
  Query: {
    search,
  },
  SearchResult: {
    __resolveType: ({ __typename }) => __typename,
  },
};
