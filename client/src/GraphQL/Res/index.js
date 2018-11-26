import gql from 'graphql-tag';

export default {

  Mutation: {

    ref: (_, { ref },  { cache }) => {
      cache.writeData({ data: { ref: ref, } });

      return {ref, __typename: 'ref' };
    },

    setPlace: (_, { id, name, type },  { cache }) => {
      cache.writeData({
        data:{
          place:{ id: id, name: name, type: type }
        }
      });

      return {id, name, type, __typename: 'place' };
    },
    setPlaceName: (_, { name },  { cache }) => {
      cache.writeData({
        data:{
          placename: name,
        }
      });

      return {name, __typename: 'PlaceName'};
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

    rootId: (_, { id },  { cache }) => {
      cache.writeData({ data: { rootId: id } });

      return {id, __typename: 'ActUrl' };
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
    sBar: (_, { barType, barShow },  { cache }) => {
      cache.writeData({ data: { barType: barType, barShow: barShow } });

      return {barType, barShow, __typename: 'Bar' };
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
    messagesListTaskUpdate: (_, {lastMessage, lastMessageId, lastMessageGroupId},  { cache }) => {

      const query = gql`
        query messagesListList($id: ID!, $messageConnection: ConnectionInput = {first: 0}) {
          task(id: $id ) @client {
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
        task: {
          messages:{
            edges: [...previousState.task.messages.edges, newFeedItem],
            __typename: "MessageConnection",
          },
          __typename: "Task"
        }
      };

      cache.writeQuery({
        query,
        data,
        variables: {"id": lastMessageGroupId}
      });


      return {lastMessage, lastMessageId, lastMessageGroupId, __typename: 'Task' };
    },
    objectCacheUpdate: (_, { value, action, objectId, taskId },  { cache }) => {
      let data;
      let query;
      let previousState;

      console.warn("ДАННЫЕ!", taskId, objectId, action, value);

      switch (action) {
      case "updateTask":
        query = gql`
          query object($id: ID!) {
            object(id: $id ) @client {
              __typename
              tasks {
                id
                name
                assignedTo
                endDate
                lastMessage
                parentId
                status
                unreadCount
                users
              }
            }
          }
        `;
        try {
          previousState = cache.readQuery({ query, variables: {"id": objectId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        Object.assign(previousState.object.tasks.filter(tasks => tasks.id === taskId)[0], { [value.key]: value.value });

        data = {
          object: {
            tasks:  [...previousState.object.tasks],
            __typename: "Object"
          }
        };

        break;
      case "createTask":
        query = gql`
          query object($id: ID!) {
            object(id: $id ) @client {
              __typename
              tasks {
                id
                name
                assignedTo
                endDate
                lastMessage
                parentId
                status
                unreadCount
                users
              }
            }
          }
        `;
        try {
          previousState = cache.readQuery({ query, variables: {"id": objectId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        // eslint-disable-next-line no-case-declarations
        const newFeedItem = {
          id: taskId,
          name: value.name ? value.name : "Не указано",
          users: value.users ? value.users : null,
          unreadCount: value.unreadCount ? value.unreadCount : 0 ,
          lastMessage: value.lastMessage ? value.lastMessage : null,
          status: value.status ? value.status : null,
          parentId: value.parentId ? value.parentId : null,
          assignedTo: value.assignedTo ?  value.assignedTo :null,
          endDate: value.endDate ? value.endDate :null,
          __typename: "Task"}

        data = {
          object: {
            tasks:  [...previousState.object.tasks, newFeedItem],
            __typename: "Object"
          }
        };

        break;
      case "deleteTask":
        query = gql`
          query object($id: ID!) {
            object(id: $id ) @client {
              __typename
              tasks {
                id
                name
              }
            }
          }
        `;
        try {
          previousState = cache.readQuery({ query, variables: {"id": objectId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        data = {
          object: {
            tasks: [...previousState.object.tasks.filter(tasks => tasks.id !== taskId)],
            __typename: "Object"
          }
        };
        break;
      default:
        break;
      }

      cache.writeQuery({
        query,
        data,
        variables: {"id": objectId}
      });

      return true;

    },
    taskCacheUpdate: (_, { value, action, taskId },  { cache }) => {
      let data;
      let query;
      let previousState;

      switch (action) {
      case "name":
        // eslint-disable-next-line no-case-declarations
        const params = `name`

        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              ${params}
              __typename
            }
          }
      `;
        data = {
          task: {
            [action]: value.name,
            __typename: "Task"
          }
        };
        break;
      case "parentId":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              parentId
              __typename
            }
          }
      `;
        data = {
          task: {
            parentId: value.parentId,
            __typename: "Task"
          }
        };
        break;
      case "endDate":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              endDate
              __typename
            }
          }
      `;
        data = {
          task: {
            endDate: value.endDate,
            __typename: "Task"
          }
        };
        break;
      case "status":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              status
              __typename
            }
          }
      `;
        data = {
          task: {
            status: parseInt(value.status),
            __typename: "Task"
          }
        };
        break;
      case "assignedTo":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              assignedTo {
                id
                username
                __typename
              }
              __typename
            }
          }
        `;
        // eslint-disable-next-line no-case-declarations
        let param = {id: value.id, username: value.name, __typename: "UserTaskRole"}

        if (!value) param = null

        data = {
          task: {
            assignedTo: param,
            __typename: "Task"
          }
        };
        break;
      case "addUser":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              users {
                id
                username
                __typename
              }
              __typename
            }
          }
        `;

        try {
          previousState = cache.readQuery({ query, variables: {"id": taskId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        data = {
          task: {
            users: [...previousState.task.users, {id: value.id, username: value.name, __typename: "User"}],
            __typename: "Task"
          }
        };
        break;
      case "delUser":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              users {
                id
                username
                __typename
              }
              __typename
            }
          }
        `;

        try {
          previousState = cache.readQuery({ query, variables: {"id": taskId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        data = {
          task: {
            users: [...previousState.task.users.filter(users => users.id !== value.id)],
            __typename: "Task"
          }
        };
        break;
      case "uploadFile":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              files {
                id
                date
                mimeType
                name
                size
                __typename
              }
              __typename
            }
          }
        `;

        try {
          previousState = cache.readQuery({ query, variables: {"id": taskId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        data = {
          task: {
            files: [...previousState.task.files, {
              id: value.id,
              date: new Date(),
              mimeType: value.mimeType,
              name: value.name,
              size: value.size,
              __typename: "File"
            }],
            __typename: "Task"
          }
        };
        break;
      case "deleteFile":
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              files {
                id
                date
                mimeType
                name
                size
                __typename
              }
              __typename
            }
          }
        `;

        try {
          previousState = cache.readQuery({ query, variables: {"id": taskId}});
        } catch (error) {
          console.warn("cache is empty!")

          return null
        }
        console.warn("prevstate is", previousState)

        data = {
          task: {
            files: [...previousState.task.files.filter(files => files.id !== value.id)],
            __typename: "Task"
          }
        };
        break;
      default:
        break;
      }

      cache.writeQuery({
        query,
        data,
        variables: {"id": taskId}
      });

      return true;
    },
  },
  Query: {
    isLiked: () => false,
  }
};
