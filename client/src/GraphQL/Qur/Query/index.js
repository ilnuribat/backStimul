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

export const getObjects = gql `
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

export const getTaskById = (id) => {
    return (
        `{
            task(id: ${id}) {
                id
                name
                assignedTo{
                  id
                  username
                }
                endDate
                status
                objectId
              }
        }
        `)
};




export const cGetChats = gql `
  query chats{
      chats
  }
`;






export const allUsers = () => `
    {
      users{
        id
        username
        __typename
      }
    }
`;

export const USERS_QUERY = gql `
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

export const PRIVS_QUERY = gql `
    query{
      user{
        directs{
          id
          name
          unreadCount
          lastMessage{
          from{
            id
            username
          }
          text
          isRead
          createdAt
        }
        }
      }
    }
`;
export const CHATS_QUERY = gql `
    query{
      user{
        directs{
          id
          name
          unreadCount
          users {
            id
            username
          }
          lastMessage{
          from{
            id
            username
          }
          text
          isRead
          createdAt
        }
        }
        tasks{
          id
          name
          unreadCount
          users {
            id
            username
          }
          lastMessage{
          from{
            id
            username
          }
          text
          isRead
          createdAt
        }
        }
      }
    }
`;

export const TASKS_QUERY = gql `
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
  query ($id: ID!, $messageConnection: ConnectionInput = {last: 30}){
      direct(id: $id ){
          id
          name
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
          __typename
      }
  }
`;

export const MESSAGE_QUERY = gql `
  query message($id: ID!){
    message(id: $id ){
          id
          isRead
          text
      }
  }
`;
export const TASK_MESSAGES = gql`
         query($id: ID!, $messageConnection: ConnectionInput = { last: 30 }) {
           task(id: $id) {
             id
             name
             users {
               id
               username
             }
             parentId
             objectId
             status
             endDate
             assignedTo {
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
             messages(messageConnection: $messageConnection) {
               edges {
                 cursor
                 node {
                   id
                   isRead
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
export const TASK_INFO = gql `
  query ($id: ID!){
    task(id: $id ){
          id
          name
          users{
              id
              username
          }
          parentId
          objectId
          status
          endDate
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
      }
  }
`;

export const TASK_INFO_SMALL = gql `
  query ($id: ID!){
    task(id: $id ){
          objectId
      }
  }
`;


export const getObjectInfo = gql `
 query getObjectInfo($id: ID!){
  object (id: $id) {
      name
    }
  }
`;
export const ObjectInfo = (id) => (`
 query{
  object (id: "${id}") {
      name
      parentId
    }
  }
`);

export const GRU_QUERY = gql `
  query group($id: ID!){
      group(id: $id ){
          users{
              id
              username
          }
      }
  }
`;


export const QUERY_ROOTID = gql `
query rootObject($id: ID){
    rootObject(id: $id){
      id
      name
      crumbs{
        id
        name
      }
      parentId
      addresses{
        id
        name
        __typename
      }
      objects{
        id
        name
        tasks{
          id
          status
          endDate
          __typename
        }
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

export const messRead = gql `{
  id
}`;

export const GroupBid = gql `
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

export const getUnreadCount2 = gql `{
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
        tasks {
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


export const getObjectTasksSmall = (id) => `
{
  object (id: "${id}") {
      tasks{
        id
        name
        parentId
        endDate
        status
      }
    }
}`;

export const checkObject = (id) => `
{
  object(id: "${id}"){
      name
    }
}`;

export const getObjectTasks = gql `
 query getObjectTasks($id: ID!){
  object (id: $id) {
      # id
      name
      parentId
      address{
          value
          coordinates
        }
      tasks{
        id
        parentId
        objectId
        name
        endDate
        status
        unreadCount
        assignedTo{
          id
          username
        }
        users{
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


export const findFiles = gql `
  query($id: ID!) {
    findFiles(id: $id) {
      fileId
    }
  }
`;

export const findFiles0 = gql `
  query($id: ID!) {
    findFiles(id: $id) {
      id
    }
  }
`;
