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

export const getObjectId = gql`
  query getObjectId{
      currentObjectId @client
      currentObjectName @client
  }
`;

export const setObjectId = gql`
  mutation setObjectId($name: String!, $id: String!){
    setObjectId(name: $name, id: $id) @client {
      id
      name
    }
  }
`;

export const createObject = gql`
  mutation createObject($name: String, $address: String!) {
    createObject(object: { name: $name, address: $address }) {
      id
      name
    }
  }
`;

export const changeObject = gql`
  mutation changeObject($id: ID!, $name: String, $address: String!) {
    updateObject(id: $id, object: { name: $name, address: $address })
  }
`;


export const deleteObject = (id) =>`
  mutation{
    deleteObject(id: "${id}")
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
        address {
          value
          coordinates
        }
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

export const createTask = gql`
  mutation createTask($name: String, $id: ID!) {
    createTask(task: { name: $name, objectId: $id }) {
      id
      name
    }
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
        address{
          value
          coordinates
        }
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

export const getObjectTasks2 = (id) => `
{
  object (id: "${id}") {
      tasks{
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

export const getObjects = gql`
 query getObjects {
  objects {
    id
    name
    address {
      value
      coordinates
    }
  }
}
`;


export const getObjectTasks = gql`
 query getObjectTasks($id: ID!){
  object (id: $id) {
      name
      parentId
      tasks{
        id
        parentId
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
        address{
          value
          coordinates
        }
      }
    }
}
`;
export const getObjectInfo= gql`
 query getObjectInfo($id: ID!){
  object (id: $id) {
      name
    }
  }
`;
export const ObjectInfo = (id)=>(`
 query{
  object (id: "${id}") {
      name
      parentId
    }
  }
`);

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

export const setActUrl = gql`
  mutation setActUrl($ActUrl: String){
    setActUrl(ActUrl: $ActUrl) @client{
      ActUrl
    }
  }
`;


export const getActUrl = gql`
  query getActUrl{
    ActUrl @client
      }
`;

export const setBar = gql`
  mutation setBar($bar: Boolean, $comp: String){
    setBar(bar: $bar, comp: $comp,) @client{
      bar
      comp
    }
  }
`;


export const getBar = gql`
  query getBar{
    bar @client
    comp @client
      }
`;

export const setInfo = gql`
  mutation setInfo($id: String, $message: String, $type:String){
    setInfo(id: $id, message: $message, type: $type) @client{
      id
      message
      type
    }
  }
`;
export const delInfo = gql`
  mutation delInfo($id: String){
    delInfo(id: $id) @client{
      id
    }
  }
`;
export const getInfo = gql`
          query Info {
            __info @client{
              id
              message
              type
            }
          }
`;


export const getDashboard = gql`
  query getDash{
    rootObject @client{
        objects{
          id
          name
        }
        addresses{
          id
          name
        }
      }
    }
`;
export const setDashboard = gql`
  mutation setBar($Dash: String){
    setDash(Dash: $Dash) @client{
      rootObject
    }
  }
`;

export const setPlace = gql`
  mutation setPlace($id: String, $name: String, $type: String ){
    setPlace(id: $id, name: $name, type: $type) @client{
      place{
        id
        name
        type
      }
    }
  }
`;
export const getPlace = gql`
  query getPlace{
      place @client{
        id
        name
        type
      }
    }
`;

export const QUERY_ROOTID = gql`
query rootObject($id: ID){
    rootObject(id: $id){
      id
      name
      parentId
      addresses{
        id
        name
        __typename
      }
      objects{
        id
        name
        address {
          value
        }
        __typename
      }
    }
}
`;

export const uploadFile = gql`
  mutation($file: Upload!, $id: ID!) {
    uploadFile(id: $id, file: $file) {
      id
      name
      size
    }
  }
`;


export const findFiles = gql`
  query($id: ID!) {
    findFiles(id: $id) {
      fileId
    }
  }
`;

export const findFiles0 = gql`
  query($id: ID!) {
    findFiles(id: $id) {
      id
    }
  }
`;
