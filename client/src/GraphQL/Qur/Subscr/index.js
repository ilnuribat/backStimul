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