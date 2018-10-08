export default {

  Mutation: {
    changeGroup: (_, { currentGroup, groupName = 'noname' },  { cache }) => {
      cache.writeData({ data: { currentGroup: currentGroup, groupName: groupName } });

      return {currentGroup, groupName, __typename: 'currentGroup' };
    },

    selectUser: (_, { userName, userId },  { cache }) => {
      cache.writeData({ data: { userName: userName, userId: userId } });

      return {userName, userId, __typename: 'selectUser' };
    },

    private: (_, { id, name },  { cache }) => {
      cache.writeData({ data: { id: id, name: name } });

      return {id, name, __typename: 'chat' };
    },
  },
  Query: {
    isLiked: () => false,
  }
};
