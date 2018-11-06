import React from 'react';
import ReactDOM from 'react-dom';
import 'tachyons';
import './index.css';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { split, ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import App from './App';
import {_url} from './constants';
import resolvers from './graph/resolvers';

const httpLink = new HttpLink({
  uri: `http://${_url}/`,
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

export const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers,
  defaults: {
    ureaded: 0,
    chats: [],
    currentGroup: "",
    userName: "",
    userId: 0,
    groupName: "",
    id: "",
    name: "",
    unr: 0,
    priv: 0,
    meid: "",
    mename: "",
    memail: "",
    tempObj:"",
    __info:[],
    ref: false,
    ActUrl: "",
    bar: false,
    comp: "",
    currentObjectId: "",
    lastMessage: {
      groupId: "",
      id: "",
      text: "",
      __typename: "lastMessageCache"
    }
  }
});

const prelink = ApolloLink.from([stateLink, httpLinkWithAuthToken]);

const wsLink = new WebSocketLink({
  uri: `ws://${_url}/graphql`,
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

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App client={client} />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
