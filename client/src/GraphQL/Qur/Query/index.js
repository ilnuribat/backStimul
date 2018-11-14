import gql from 'graphql-tag';


export const LoginQuery = (email, password) => `
mutation{
  login(user:{email:"${email}",password:"${password}"}){
    id
    username
    jwt
  }
}
`;

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



export const getPriority = () => `{
    glossary{
        priorities{
          name
          id
        }
      }
    }
`;


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




export const cGetChats = gql`
  query chats{
      chats
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

export const GR_QUERY = gql`
  query task($id: ID!, $messageConnection: ConnectionInput = {first: 0}){
    task(id: $id ){
          name
          users{
              id
              username
          }
          # files {
          #   id
          #   size
          #   name
          #   mimeType
          #   date
          # }
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


export const getObjectTasks3 = (id) => `
{
  object (id: "${id}") {
      tasks{
        id
        name
        parentId
      }
    }
}`;

export const getObjectTasks = gql`
 query getObjectTasks($id: ID!){
  object (id: $id) {
      name
      parentId
      address{
          value
          coordinates
        }
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

      }
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





