export default {

  Mutation: {
    changeGroup: (_, { currentGroup, groupName = 'noname' },  { cache }) => {
      cache.writeData({ data: { currentGroup: currentGroup, groupName: groupName } });

      return {currentGroup, groupName, __typename: 'currentGroup' };
    },

    countPrivates: (_, { unr },  { cache }) => {
      cache.writeData({ data: { unr: unr } });

      return {unr, __typename: 'countPrivates' };
    },

    selectUser: (_, { userName, userId },  { cache }) => {
      cache.writeData({ data: { userName: userName, userId: userId } });

      return {userName, userId, __typename: 'selectUser' };
    },
    me: (_, { meid, mename, memail },  { cache }) => {
      cache.writeData({ data: { meid: meid, mename: mename, memail: memail, } });

      return {meid, mename, memail, __typename: 'me' };
    },

    private: (_, { id, name, unr },  { cache }) => {
      cache.writeData({ data: { id: id, name: name, unr: unr } });

      return {id, name, __typename: 'chat' };
    },
  },
  Query: {
    isLiked: () => false,
  }
};
