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

    // lastMessageCache: (_, { lastMessage, lastMessageId, lastMessageGroupId },  { cache }) => {

    //   cache.writeData({ data: { lastMessage: {text: lastMessage, id: lastMessageId, groupId: lastMessageGroupId, __typename: 'lastMessageCache' } }});

    //   return {lastMessage, lastMessageId, lastMessageGroupId, __typename: 'lastMessageCache' };
    // },

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

    messagesCacheUpdate: (_, {lastMessage, queryName},  { cache }) => {
      const tname = queryName.charAt(0).toUpperCase()+queryName.substring(1)

      // console.warn("queryName is", queryName, tname)
      const query = gql`
        query ($id: ID!, $messageConnection: ConnectionInput = {last: 50}) {
          ${queryName}(id: $id ) @client {
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
        previousState = cache.readQuery({ query, variables: {"id": lastMessage.groupId}});
      } catch (error) {
        console.warn("cache is messagesCacheUpdate empty!")

        return null
      }

      // console.warn("lastMessage is", lastMessage)
      // console.warn("prevstate is", previousState)
      // console.warn("queryName is", queryName, tname)

      const newFeedItem = {cursor: lastMessage.id, node: {...lastMessage,  __typename: "Message"},
        __typename: "MessageEdge" };

      let edges;

      queryName === "task" ? edges = [...previousState.task.messages.edges, newFeedItem] : edges = [...previousState.direct.messages.edges, newFeedItem]

      const data = {
        [queryName]: {
          messages:{
            edges: edges,
            __typename: "MessageConnection",
          },
          __typename: tname
        }
      };

      cache.writeQuery({
        query,
        data,
        variables: {"id": lastMessage.groupId}
      });


      return {lastMessage, __typename: tname };
    },
    chatListCacheUpdate: (_, { value, queryName, counter },  { cache }) => {
      const query = gql`
          query {
            user @client {
              ${queryName} {
                id
                name
                unreadCount
                lastMessage{
                  createdAt
                  from{
                    id
                    username
                  }
                  text
                }
              }
            }
          }
      `;
      let previousState;
      let data;

      try {
        previousState = cache.readQuery({ query });
      } catch (error) {
        console.warn("cache is empty!")

        return null
      }
      // console.warn("prevstate unrPrivatesCacheUpdate is", previousState, value)

      if (!value.addUser) {
        let filter
        let count = 0

        if (counter) count = 1

        queryName === "directs" ? filter = previousState.user.directs.filter(directs => directs.id === value.groupId)[0] :
          filter = previousState.user.tasks.filter(tasks => tasks.id === value.groupId)[0]
        !value.reset ? Object.assign(filter, { unreadCount: filter.unreadCount + count, lastMessage : { from: value.from, text: value.text, createdAt: value.createdAt,  __typename: "Message"} }) :
          Object.assign(filter, { unreadCount: 0, lastMessage: filter.lastMessage })

        data = {
          user: {
            [queryName]: queryName === "directs" ? [...previousState.user.directs] : [...previousState.user.tasks],
            __typename: "User",
          }
        };
      } else {
        data = {
          user: {
            directs: [...previousState.user.directs, {...value, unreadCount: 0, lastMessage: null, __typename: "Direct"}],
            __typename: "User",
          }
        };
      }

      cache.writeQuery({
        query,
        data,
      });

      return true;

    },
    objectCacheUpdate: (_, { value, action, objectId, taskId },  { cache }) => {
      let data;
      let query;
      let previousState;

      if (value && value.key && value.key==="status") value.value = parseInt(value.value)
      // console.warn("ДАННЫЕ!", taskId, objectId, action, value);

      switch (action) {
      case "lastMessage":
        query = gql`
          query object($id: ID!) {
            object(id: $id ) @client {
              __typename
              tasks {
                id
                lastMessage{
                  from{
                    id
                    username
                  }
                  text
                }
                __typename
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
        // console.warn("prevstate is", previousState)

        Object.assign(previousState.object.tasks.filter(tasks => tasks.id === taskId)[0], { lastMessage : { from: value.from, text: value.text , __typename: "Message"} });

        // console.warn("prevstate is",  previousState.object.tasks)

        data = {
          object: {
            tasks:  previousState.object.tasks,
            __typename: "Object"
          }
        };

        break;
      case "updateTask":
        query = gql`
          query object($id: ID!) {
            object(id: $id ) @client {
              __typename
              tasks {
                id
                name
                # assignedTo
                endDate
                # lastMessage
                parentId
                status
                unreadCount
                # users
                __typename
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
        // console.warn("prevstate is", previousState)

        Object.assign(previousState.object.tasks.filter(tasks => tasks.id === taskId)[0], { [value.key]: value.value });

        // console.warn("prevstate is",  previousState.object.tasks)

        data = {
          object: {
            tasks:  previousState.object.tasks,
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
                endDate
                parentId
                objectId
                status
                unreadCount
                assignedTo{
                  id
                  username
                }
                files {
                  id
                  size
                  name
                  mimeType
                  date
                }
                users{
                  id
                  username
                }
                lastMessage{
                  from{
                    id
                    username
                  }
                  text
                }
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
        // console.warn("prevstate is", previousState)

        data = {
          object: {
            tasks:  [...previousState.object.tasks, {
              // id: taskId,
              ...value,
              // objectId,
              // files: value.files ?  value.files :null,
              // name: value.name ? value.name : "Не указано",
              // users: value.users ? value.users : null,
              // unreadCount: value.unreadCount ? value.unreadCount : 0 ,
              // lastMessage: value.lastMessage ? value.lastMessage : null,
              // status: value.status ? value.status : null,
              // parentId: value.parentId ? value.parentId : null,
              // assignedTo: value.assignedTo ?  value.assignedTo :null,
              // endDate: value.endDate ? value.endDate :null,
              // __typename: "Task"
            }],
            __typename: "Object"
          }
        };

        break;
      case "deleteTask":
        query = gql`
          query object($id: ID!) {
            object(id: $id ) @client {
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
            tasks: previousState.object.tasks.filter(tasks => tasks.id !== taskId),
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

      if (value && value.status) value.status = parseInt(value.status)

      switch (action) {
      default:
        // console.warn("ДАННЫЕ!", taskId, action, value);
        query = gql`
          query task($id: ID!) {
            task(id: $id ) @client {
              ${value.key}
              __typename
            }
          }
      `;
        data = {
          task: {
            [value.key]: value.value,
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
        let param = {...value, __typename: "UserTaskRole"}

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
            users: [...previousState.task.users, {...value, __typename: "User"}],
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
            users: previousState.task.users.filter(users => users.id !== value.id),
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
            files: previousState.task.files.filter(files => files.id !== value.id),
            __typename: "Task"
          }
        };
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
