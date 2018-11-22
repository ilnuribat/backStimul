import gql from 'graphql-tag';


export const meGet = gql `
  query meGet{
      meid @client
      mename @client
      memail @client
    }
`;

export const getObjectId = gql `
  query getObjectId{
    currentObjectId @client
      currentObjectName @client
  }
`;
export const appendUser = gql `
  query appendUser {
    userName @client
    userId @client
  }
`;
export const getChat = gql `
  query private{
      id @client
      name @client
      unr @client
      priv @client
  }
`;
export const cGetCountPrivates = gql `
  query countPrivates {
    unr @client
  }
`;
export const getlastMessageCache = gql `
  query getlastMessageCache{
      lastMessage @client {
        groupId
        id
        text
      }
      id @client
  }
`;
export const tempObjGet = gql `
  query tempObjGet{
        tempObj @client
      }
`;

export const getRefGroups = gql `
  query Ref{
    ref @client
  }
`;

export const getTemp = gql `
  query getTemp{
        tempObj @client
      }
`;

export const getActUrl = gql `
  query getActUrl{
    ActUrl @client
      }
`;

export const getBar = gql `
  query getBar{
    bar @client
    comp @client
      }
`;

export const gBar = gql `
  query gBar{
    barShow @client
    barType @client
      }
`;

export const getInfo = gql `
          query Info {
            __info @client{
              id
              message
              type
            }
          }
`;

export const getDashboard = gql `
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

export const getPlace = gql `
  query getPlace{
      place @client{
        id
        name
        type
        # __typename
      }
    }
`;
export const getPlaceName = gql `
  query getPlaceName{
      placename @client
    }
`;


export const getCUser = gql `
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

export const getObjectTasksTemp = gql `
 query getObjectTasksTemp($id: ID!){
  object (id: $id) @client{
      tasks{
        id
        parentId
        name
        status
      }
    }
}
`;



export const tempObj = gql `
  mutation tempObj($tempObj: String!){
    tempObj (tempObj: $tempObj) @client{
      tempObj
    }
  }
`;
export const setActUrl = gql `
  mutation setActUrl($ActUrl: String){
    setActUrl(ActUrl: $ActUrl) @client{
      ActUrl
    }
  }
`;
export const setDashboard = gql `
  mutation setBar($Dash: String){
    setDash(Dash: $Dash) @client{
      rootObject
    }
  }
`;

export const setPlace = gql `
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

export const setPlaceName = gql `
  mutation setPlaceName( $name: String ){
    setPlaceName( name: $name ) @client{
        name
     }
  }
`;

export const setTemp = gql `
  mutation setTemp($tempObj: String){
    setTemp(tempObj: $tempObj) @client{
      tempObj
    }
  }
`;
export const messagesListTaskUpdate = gql `
  mutation messagesListTaskUpdate($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    messagesListTaskUpdate(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
    }
  }
`;
export const messagesListDirectUpdate = gql `
  mutation messagesListDirectUpdate($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    messagesListDirectUpdate(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
    }
  }
`;
export const taskCacheUpdate = gql `
  mutation taskCacheUpdate($action: String!, $value: String, $userName: String, $taskId: String!, $object: Object) {
    taskCacheUpdate(action: $action, value: $value, userName: $userName, taskId: $taskId, object: $object) @client
  }
`;
export const delInfo = gql `
  mutation delInfo($id: String){
    delInfo(id: $id) @client{
      id
    }
  }
`;
export const setInfo = gql `
  mutation setInfo($id: String, $message: String, $type:String){
    setInfo(id: $id, message: $message, type: $type) @client{
      id
      message
      type
    }
  }
`;
export const setRefGroups = gql `
mutation Ref($ref: String){
  ref(ref: $ref) @client{
    ref
  }
}
`;


export const setBar = gql `
mutation setBar($bar: Boolean, $comp: String){
  setBar(bar: $bar, comp: $comp,) @client{
    bar
    comp
  }
}
`;
export const cSetCountPrivates = gql `
  mutation countPrivates($unr:Number){
    countPrivates(unr: $unr) @client{
      unr
    }
  }
`;
export const selectUser = gql `
  mutation selectUser($userName: String!, $userId: String!) {
    selectUser(userName: $userName, userId: $userId) @client {
      userName
      userId
    }
  }
`;

export const cSetChats = gql `
  mutation privates($name: String!, $id: String!){
    privates(name: $name, id: $id) @client {
      chats
    }
  }
`;

export const setChat = gql `
  mutation private($name: String!, $id: String!){
    private(name: $name, id: $id) @client {
      id
      name
    }
  }
`;

export const setObjectId = gql `
  mutation setObjectId($name: String!, $id: String!){
    setObjectId(name: $name, id: $id) @client {
      id
      name
    }
  }
`;
export const rootId = gql `
  mutation rootId($id: String!){
    rootId(id: $id) @client {
      rootId
    }
  }
`;

export const meSet = gql `
  mutation meSet($meid: String, $mename: String, $memail: String) {
    meSet(meid: $meid, mename: $mename, memail: $memail) @client {
      meid
      mename
      memail
    }
  }
`;
export const sBar = gql `
  mutation sBar($barType: String, $barShow: Bool) {
    sBar(barType: $barType, barShow: $barShow) @client {
      barType
      barShow
    }
  }
`;

export const lastMessageCache = gql `
  mutation lastMessageCache($lastMessage: String!, $lastMessageId: String!, $lastMessageGroupId: String!) {
    lastMessageCache(lastMessage: $lastMessage, lastMessageId: $lastMessageId, lastMessageGroupId: $lastMessageGroupId) @client {
      lastMessage
      lastMessageId
      lastMessageGroupId
    }
  }
`;
