import React from 'react';
import ReactDOM from 'react-dom';

import 'tachyons';
import './index.css';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-client-preset';
import { BrowserRouter } from 'react-router-dom';
import { AUTH_TOKEN } from './constants';
import App from './App';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import {url} from './constants';


const httpLink = new HttpLink({
  uri: `http://${url}/`,
  // uri: 'http://localhost:8081/',
  // uri: 'http://185.168.187.103:8500/graphql',
});


const middlewareLink = setContext((req, previousContext) => {
  // get the authentication token from local storage if it exists
  const jwt = localStorage.getItem('auth-token');
  if (jwt) {
    return {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
  }
  return previousContext;
});
// const middlewareAuthLink = new ApolloLink((operation, forward) => {
//   const jwt = localStorage.getItem('auth-token');
//   const authorizationHeader = jwt ? `Bearer ${jwt}` : null;

//   operation.setContext({
//     headers: {
//       authorization: authorizationHeader,
//     },
//   });

//   return forward(operation);
// });

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);
// const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

// const client = new ApolloClient({
//   link: httpLinkWithAuthToken,
//   cache: new InMemoryCache(),
// });

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://${url}/graphql`,
  options: {
    // lazy: true,
    reconnect: true,
    connectionParams() {
      return { jwt: localStorage.getItem('auth-token') };
    },
    jwt: localStorage.getItem('auth-token'),
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithAuthToken,
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

// export function newgql(query, type) {
//   const data = client.query({query: query, type: type})
//   return {
//     type: type,
//     payload: new Promise((resolve, reject) => {
//       data.then(response => resolve(response)).catch(error => reject(error))
//     })
//   }
// }


ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
