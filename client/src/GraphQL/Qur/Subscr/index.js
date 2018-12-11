import gql from 'graphql-tag';

export const MESSAGE_SUBS = gql`
subscription message($id: ID!){
  message(id: $id ){
        isRead
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
          objectId
      }
  }
`;

export const MESSAGE_READ = gql`
  subscription messageRead($id: ID!){
      messageRead(id: $id){
        id
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
export const TASK_UPDATED = gql`
subscription {
  taskUpdated{
        id
        name
        parentId
        objectId
        endDate
        status
        # users{
        #   id
        #   username
        # }
        assignedTo{
          id
          username
        }
        files {
          id
          date
          mimeType
          name
          size
        }
      }
}`;

export const USER_TASK_UPDATED = gql`
  subscription {
    userTaskUpdated{
          action
          user{
              id
              username
          }
          task {
            id
            name
            parentId
            objectId
            endDate
            status
            unreadCount
            assignedTo{
              id
              username
            }
            files {
              id
              date
              mimeType
              name
              size
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
