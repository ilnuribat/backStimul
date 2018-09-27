import gql from "graphql-tag";

const GR_QUERY = gql`
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
const ADD_MUT = gql`
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

export { MESSAGE_CREATED, GR_QUERY, ADD_MUT };