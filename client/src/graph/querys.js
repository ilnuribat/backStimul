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
    name
    users{
      id
      username
    }
  }
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


export const showCurrentGroup = gql`
  query showCurrentGroup {
    currentGroup @client
    groupName @client
  }
`;

export const changeGroup = gql`
  mutation changeGroup($currentGroup: String!, $groupName: String!) {
    changeGroup(currentGroup: $currentGroup, groupName: $groupName) @client {
      currentGroup
      groupName
    }
  }
`;

export const getPrivateChat = gql`
  query private{
      id @client
      name @client
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
        id
        directs{
          id
          name
          messages{
            edges{
              node{
                id
              }
            }
          }
        }
      }
    }
`;

export const PRIV_QUERY = gql`
  query group($id: ID!, $messageConnection: ConnectionInput = {first: 0}){
      direct(id: $id ){
          messages(messageConnection: $messageConnection) {
              edges {
                  cursor
                  node {
                      id
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
export const GR_QUERY = gql`
  query group($id: ID!, $messageConnection: ConnectionInput = {first: 0}){
      group(id: $id ){
          id
          name
          users{
              id
              username
          }
          messages(messageConnection: $messageConnection) {
              edges {
                  cursor
                  node {
                      id
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
              }
              to{
                  id
              }
      }
  }
`;

export const SUBS_GR = (id) => `
  subscription messageAdded(groupId: ${id}){
          id
          text
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

