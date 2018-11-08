import gql from 'graphql-tag';

export default {

  Mutation: {

    ref: (_, { ref },  { cache }) => {
      cache.writeData({ data: { ref: ref, } });

      return {ref, __typename: 'ref' };
    },
    
    setPlace: (_, { id, name, type },  { cache }) => {
      cache.writeData({ data: { id: id, name: name, type: type, } });

      return {id, name, type, __typename: 'place' };
    },
    setInfo: (_, { id, message, type },  { cache }) => {

      const { __info } = cache.readQuery({
        query: gql`
          query Info {
            __info{
              id
              message
              type
            }
          }
        `,
      });
      let newInfo = [...__info, {id: id, message: message, type: type}]

      cache.writeData({ data: { __info: newInfo, } });

      return {id, message, type , __typename: '__Info' };
    },

    // tempObj: (_, { tempObj },  { cache }) => {
    //   cache.writeData({ data: { tempObj: tempObj, } });

    //   return {tempObj, __typename: 'tempObj' };
    // },

    setDash: (_, { Dash },  { cache }) => {
      cache.writeData({ data: { Dash: Dash, } });

      return {Dash, __typename: 'Dash' };
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

    lastMessageCache: (_, { lastMessage, lastMessageId, lastMessageGroupId },  { cache }) => {

      cache.writeData({ data: { lastMessage: {text: lastMessage, id: lastMessageId, groupId: lastMessageGroupId, __typename: 'lastMessageCache' } }});

      return {lastMessage, lastMessageId, lastMessageGroupId, __typename: 'lastMessageCache' };
    },

    meSet: (_, { meid, mename, memail },  { cache }) => {
      cache.writeData({ data: { meid: meid, mename: mename, memail: memail } });

      return {meid, mename, memail, __typename: 'me' };
    },

    setTemp: (_, { tempObj },  { cache }) => {
      cache.writeData({ data: { tempObj: tempObj } });

      return {tempObj, __typename: 'tempObj' };
    },

    setActUrl: (_, { ActUrl },  { cache }) => {
      cache.writeData({ data: { ActUrl: ActUrl } });

      return {ActUrl, __typename: 'ActUrl' };
    },

    setBar: (_, { bar, comp },  { cache }) => {
      cache.writeData({ data: { bar: bar, comp: comp } });

      return {bar, comp, __typename: 'BarState' };
    },

    private: (_, { id, name },  { cache }) => {
      cache.writeData({ data: { id: id, name: name } });

      return {id, name, __typename: 'chat' };
    },

    setObjectId: (_, { id, name },  { cache }) => {
      cache.writeData({ data: { currentObjectId: id, currentObjectName: name } });

      return {id, name, __typename: 'chat' };
    },
    messagesListDirectUpdate: (_, {lastMessage, lastMessageId, lastMessageGroupId},  { cache }) => {
      const query = gql`
        query messagesListList($id: ID!, $messageConnection: ConnectionInput = {first: 0}) {
          direct(id: $id ) @client {
            messages(messageConnection: $messageConnection) {
              edges {
                cursor
                node {
                  id
                  text
                }
              }
            }
            __typename
          }
        # id @client
        }
      `;

      let previousState;

      try {
        previousState = cache.readQuery({ query, variables: {"id": lastMessageGroupId}});
      } catch (error) {
        console.warn("cache is empty!")

        return null
      }

      // console.warn("prevstate is", previousState)

      const newFeedItem = {cursor: lastMessageId, node: {id: lastMessageId, text: lastMessage,  __typename: "Message"},
        __typename: "MessageEdge" };

      const data = {
        direct: {
          messages:{
            edges: [...previousState.direct.messages.edges, newFeedItem],
            __typename: "MessageConnection",
          },
          __typename: "Direct"
        }
      };

      cache.writeQuery({
        query,
        data,
        variables: {"id": lastMessageGroupId}
      });


      return {lastMessage,lastMessageId, lastMessageGroupId, __typename: 'Direct' };
    },
    messagesListGroupUpdate: (_, {lastMessage, lastMessageId, lastMessageGroupId},  { cache }) => {

      const query = gql`
        query messagesListList($id: ID!, $messageConnection: ConnectionInput = {first: 0}) {
          group(id: $id ) @client {
            messages(messageConnection: $messageConnection) {
              edges {
                cursor
                node {
                  id
                  text
                }
              }
            }
            __typename
          }
        # id @client
        }
      `;

      let previousState;

      try {
        previousState = cache.readQuery({ query, variables: {"id": lastMessageGroupId}});
      } catch (error) {
        console.warn("cache is empty!")

        return null
      }

      // console.warn("lastMessage is", lastMessage)
      // console.warn("prevstate is", previousState)

      const newFeedItem = {cursor: lastMessageId, node: {id: lastMessageId, text: lastMessage,  __typename: "Message"},
        __typename: "MessageEdge" };

      const data = {
        group: {
          messages:{
            edges: [...previousState.group.messages.edges, newFeedItem],
            __typename: "MessageConnection",
          },
          __typename: "Group"
        }
      };

      cache.writeQuery({
        query,
        data,
        variables: {"id": lastMessageGroupId}
      });


      return {lastMessage, lastMessageId, lastMessageGroupId, __typename: 'Group' };
    },
  },
  Query: {
    isLiked: () => false,
  }
};
