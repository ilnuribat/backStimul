import gql from 'graphql-tag';

export const tempObj = gql`
  mutation tempObj($tempObj: String!){
    tempObj (tempObj: $tempObj) @client{
      tempObj
    }
  }
`;
export const setActUrl = gql`
  mutation setActUrl($ActUrl: String){
    setActUrl(ActUrl: $ActUrl) @client{
      ActUrl
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
export const meGet = gql`
  query meGet{
      meid @client
      mename @client
      memail @client
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
export const setTemp = gql`
  mutation setTemp($tempObj: String){
    setTemp(tempObj: $tempObj) @client{
      tempObj
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
export const messagesListDirectUpdate = gql`
  mutation messagesListDirectUpdate($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    messagesListDirectUpdate(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
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
export const setInfo = gql`
  mutation setInfo($id: String, $message: String, $type:String){
    setInfo(id: $id, message: $message, type: $type) @client{
      id
      message
      type
    }
  }
`;
export const setRefGroups = gql`
mutation Ref($ref: String){
  ref(ref: $ref) @client{
    ref
  }
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