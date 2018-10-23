import gql from 'graphql-tag';

export const updTask = (...params) => {
  return (`mutation{
        updateTask(id: "${params[0]}", ${params[1]})
      }`)
};

export const createGroup = (params) => {
  return (`mutation{
          createGroup(group: ${params}){
            id
          }
        }`)
};

export const createDirect = (params) => {
  return (`mutation{
          directMessage(id: ${params}){
            id
          }
        }`)
};

export const user = (id) => `
query{
  user {
    groups{
      id
      name
    }
  }
}
`;

export const group = (gid) => `
query{
  group(id: "${gid}"){
    id
    name
    users{
      id
      username
    }
    endDate
    assignedTo{
      id
      username
    }
    status
  }
  }
`;

export const groupMut = (gid,params) =>`
  mutation{
    updateGroup(id: "${gid}", group: {${params}})
  }
`;


export const getPriority = () => `{
    glossary{
        priorities{
          name
          id
        }
      }
    }
`;

export const crTask = (...params) => {return(`
  mutation{
        createTask(${params}){
          id
        }
      }
`)};

export const getById = (id) => {
  return (
    `{
            task(id: ${id}) {
                id
                name
                description
                index
                columnId
                priority
              }
        }
        `)
};


export const meSet = gql`
  mutation meSet($meid: String, $mename: String, $memail: String) {
    meSet(meid: $meid, mename: $mename, memail: $memail) @client {
      meid
      mename
      memail
    }
  }
`;
export const meGet = gql`
  query meGet{
      meid @client
      mename @client
      memail @client
    }
`;

export const selectUser = gql`
  mutation selectUser($userName: String!, $userId: String!) {
    selectUser(userName: $userName, userId: $userId) @client {
      userName
      userId
    }
  }
`;

export const appendUser = gql`
  query appendUser {
    userName @client
    userId @client
  }
`;

export const cGetCountPrivates = gql`
  query countPrivates {
    unr @client
  }
`;

export const cSetCountPrivates = gql`
  mutation countPrivates($unr:Number){
    countPrivates(unr: $unr) @client{
      unr
    }
  }
`;


export const getPrivateChat = gql`
  query private{
      id @client
      name @client
      unr @client
      priv @client
  }
`;

export const cGetChats = gql`
  query chats{
      chats
  }
`;

export const cSetChats = gql`
  mutation privates($name: String!, $id: String!){
    privates(name: $name, id: $id) @client {
      chats
    }
  }
`;

export const setPrivateChat = gql`
  mutation private($name: String!, $id: String!){
    private(name: $name, id: $id) @client {
      id
      name
    }
  }
`;

export const getlastMessageCache = gql`
  query getlastMessageCache{
      lastMessage @client {
        groupId
        id
        text
      }
      id @client
  }
`;

export const lastMessageCache = gql`
  mutation lastMessageCache($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    lastMessageCache(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
    }
  }
`;

export const allUsers = () => `
    {
      users{
        id
        username
      }
    }
`;

export const USERS_QUERY = gql`
    query{
      users{
        id
        username
      }
    }
`;

export const privates = () => `
    {
      user{
        id
        directs{
          id
          name
        }
      }
    }
`;

export const PRIVS_QUERY = gql`
    query{
      user{
        directs{
          id
          name
          unreadCount
        }
      }
    }
`;

export const TASKS_QUERY = gql`
    query{
      user{
        groups{
        id
        name
        users{
          id
          username
        }
        unreadCount
        status
        assignedTo{
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
        endDate
      }
      }
    }
`;

export const PRIV_QUERY = gql`
  query group($id: ID!, $messageConnection: ConnectionInput = {first: 0}){
      direct(id: $id ){
          unreadCount
          messages(messageConnection: $messageConnection) {
              edges {
                  cursor
                  node {

                      isRead
                      id
                      userId
                      from {
                      id
                      username
                      }
                      createdAt
                      text
                  }
              }
          }
      }
  }
`;

export const MESSAGE_QUERY = gql`
  query message($id: ID!){
    message(id: $id ){
          isRead
          text
      }
  }
`;

export const MESSAGE_SUBS = gql`
  subscription message($id: ID!){
    message(id: $id ){
          isRead
      }
  }
`;

export const MESSAGEREAD_MUT = gql`
  mutation message($id: ID!){
    messageRead(id: $id )
  }
`;

export const messageRead_MUT = (id)=> {return(`
mutation {
  messageRead(id: "${id}" )
}
`)};

export const GR_QUERY = gql`
  query group($id: ID!, $messageConnection: ConnectionInput = {first: 0}){
      group(id: $id ){
          name
          users{
              id
              username
          }
          messages(messageConnection: $messageConnection) {
              edges {
                  cursor
                  node {
                      isRead
                      id
                      userId
                      from {
                      id
                      username
                      }
                      createdAt
                      text
                  }
              }
              pageInfo {
                  hasNextPage
                  hasPreviousPage
              }
          }
      }
  }
`;

export const MESSAGE_CREATED = gql`
  subscription Added($id: String!){
      messageAdded(groupId: $id){
          id
          text
          from{
            id
            username
          }
          createdAt
          userId
          isRead
      }
  }
`;

export const ALL_MESSAGE_CREATED = gql`
  subscription {
      messageAdded{
          id
          text
          from{
            id
            username
          }
          createdAt
          userId
          groupId
          isRead
          isDirect
      }
  }
`;

export const MESSAGE_READ = gql`
  subscription messageRead($id: ID!){
      messageRead(id: $id){
        isRead
      }
  }
`;

export const SUBS_GR = (id) => `
  subscription messageAdded(groupId: ${id}){
          id
          text
  }
`;

export const glossaryStatus = () => `
  {
    glossary{
      taskStatuses{
        id
        name
      }
    }
}
`;

export const ADD_MUT = gql`
mutation Add($id: String!, $text: String! ){
    createMessage(message:{groupId: $id, text: $text}){
      id
      text
      from{
          id
      }
      to{
          id
      }
    }
  }`;

export const messRead = gql`{
  id
}`;

export const GroupBid = gql`
query group($id: ID!){
    group( id: $id ){
      name
      status
      endDate
      assignedTo{
        id
        username
      }
    }
  }
`;

export const getUnreadCount2 = gql`{
    user {
      directs {
        id
        unreadCount
      }
      groups {
        id
        unreadCount
      }
    }
}`;


export const getUnreadCount = () => `
    {
      user{
        directs{
          id
          unreadCount
        }
        groups {
          id
          unreadCount
        }
      }
    }
`;

export const taskUpdated = gql`
subscription taskUpdated($id: ID!){
  taskUpdated(id: $id){
        id
        name
        users{
          id
          username
        }
        unreadCount
        status
        assignedTo{
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
        endDate
      }
}`;

export const getCUser = gql`
query getCUser{
    user @client{
      groups{
        id
        name
        users{
          id
          username
        }
        unreadCount
        status
        assignedTo{
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
        endDate
      }
    }
}`;


export const GRU_QUERY = gql`
  query group($id: ID!){
      group(id: $id ){
          users{
              id
              username
          }
      }
  }
`;

export const userTaskUpdated = gql`
  subscription userTaskUpdated($id: ID!){
    userTaskUpdated(id: $id){
          action
          user{
              id
              username
          }
      }
  }
`;

export const tempObj = gql`
  mutation tempObj($tempObj: String!){
    tempObj (tempObj: $tempObj) @client{
      tempObj
    }
  }
`;

export const tempObjGet = gql`
  query tempObjGet{
        tempObj @client
      }
`;

export const getRefGroups = gql`
  query Ref{
    ref @client
  }
`;

export const setRefGroups = gql`
  mutation Ref($ref: String){
    ref(ref: $ref) @client{
      ref
    }
  }
`;



export const messagesListDirectUpdate = gql`
  mutation messagesListDirectUpdate($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    messagesListDirectUpdate(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
    }
  }
`;


export const messagesListGroupUpdate = gql`
  mutation messagesListGroupUpdate($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    messagesListGroupUpdate(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
    }
  }
`;

export const setTemp = gql`
  mutation setTemp($tempObj: String){
    setTemp(tempObj: $tempObj) @client{
      tempObj
    }
  }
`;
export const getTemp = gql`
  query getTemp{
        tempObj @client
      }
`;
