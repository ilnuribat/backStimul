import gql from 'graphql-tag';

export const setObjectId = gql`
  mutation setObjectId($name: String!, $id: String!){
    setObjectId(name: $name, id: $id) @client {
      id
      name
    }
  }
`;

export const meSet = gql`
  mutation meSet($meid: String, $mename: String, $memail: String) {
    meSet(meid: $meid, mename: $mename, memail: $memail) @client {
      meid
      mename
      memail
    }
  }
`;
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
export const groupMut = (gid,params) =>`
  mutation{
    updateGroup(id: "${gid}", group: {${params}})
  }
`;

export const crTask = (...params) => {return(`
  mutation{
        createTask(${params}){
          id
        }
      }
`)};
export const cSetCountPrivates = gql`
  mutation countPrivates($unr:Number){
    countPrivates(unr: $unr) @client{
      unr
    }
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



export const lastMessageCache = gql`
  mutation lastMessageCache($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    lastMessageCache(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
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


export const uploadFile = gql`
  mutation($file: Upload!, $id: ID!) {
    uploadFile(id: $id, file: $file) {
      id
      name
      size
    }
  }
`;










