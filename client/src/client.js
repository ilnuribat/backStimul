import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { split, ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';
import { _url, protocol, wsProtocol } from './constants';
import resolvers from './GraphQL/Res';

console.warn({ _url, protocol, wsProtocol });

const httpLink = createUploadLink({
  uri: `${protocol}${_url}/`,
});



const middlewareLink = setContext((req, previousContext) => {
  const jwt = localStorage.getItem('auth-token');

  if (jwt) {
    return {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
  }

  return previousContext;
});

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers,
  defaults: {
    chats: [],
    currentGroup: "",
    groupName: "",
    userName: "",
    userId: 0,
    id: "",
    name: "",
    unr: 0,
    priv: 0,
    // meid: "",
    // mename: "",
    // memail: "",
    // tempObj:"",
    __info:[],
    ref: false,
    ActUrl: "",
    bar: false,
    comp: "",
    rootId: "",
    currentObjectId: "",
    currentObjectName: "",
    barShow: false,
    barType: "search",
    placename:"Root",
    place:{
      id: "no",
      name: "Root",
      type: "no",
      __typename: "place",
    },
    // lastMessage: {
    //   groupId: "",
    //   id: "",
    //   text: "",
    //   __typename: "lastMessageCache"
    // }
  }
});

const prelink = ApolloLink.from([stateLink, httpLinkWithAuthToken]);
const wsLink = new WebSocketLink({
  uri: `${wsProtocol}${_url}/graphql`,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams() {
      return { Authorization: `Bearer ${localStorage.getItem('auth-token')}` };
    },
    jwt: localStorage.getItem('auth-token'),
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  prelink,
);

const client = new ApolloClient({
  link,
  cache
})

export default client;
