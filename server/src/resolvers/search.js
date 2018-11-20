module.exports = {
  Query: {
    search() {
      return [{
        _id: 'asdf1',
        id: 'asdf2',
        email: 'Ilnur1',
        __typename: 'User',
      }, {
        __typename: 'Task',
        id: 'asdf',
        name: 'new task',
      }, {
        __typename: 'Object',
        id: 'address id',
        name: 'Ufa',
      }, {
        __typename: 'Message',
        id: 'message id',
        text: 'some message text',
      }];
    },
  },
  SearchResult: {
    __resolveType() {
      return null;
    },
  },
};
