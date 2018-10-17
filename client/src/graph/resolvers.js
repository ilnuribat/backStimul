export default {

  Mutation: {
    tempObj: (_, { tempObj },  { cache }) => {
      cache.writeData({ data: { tempObj: tempObj, } });

      return {tempObj, __typename: 'tempObj' };
    },

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

    meSet: (_, { meid, mename, memail },  { cache }) => {
      cache.writeData({ data: { meid: meid, mename: mename, memail: memail } });

      return {meid, mename, memail, __typename: 'me' };
    },

    private: (_, { id, name, unr=0, priv=false },  { cache }) => {
      cache.writeData({ data: { id: id, name: name, unr: unr, priv: priv } });

      return {id, name, unr, priv, __typename: 'chat' };
    },
  },
  Query: {
    isLiked: () => false,
  }
};
