import gql from "graphql-tag";


  const GR_QUERY = gql`
  query group($id: Int!, $messageConnection: ConnectionInput = {first: 0}){
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
                      to {
                      id
                      }
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

const MESSAGE_CREATED = gql`
  subscription{
      messageAdded(groupIds: 4){
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
const ADD_MUT = gql`
mutation Add($id: Int!, $text: String! ){
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

export { MESSAGE_CREATED, GR_QUERY, ADD_MUT };