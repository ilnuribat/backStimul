const ws = require('ws');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const { ApolloClient } = require('apollo-client');
const { WebSocketLink } = require('apollo-link-ws');
const { generateToken } = require('../server/src/services/user');
const { User } = require('../server/src/models');
const { server } = require('../server');

before(async function () {
  chai.use(chaiHttp);
  const requester = chai.request(server).keepOpen();
  this.httpPort = () => server.address().port;

  this.email = 'test@User.guov';
  this.password = '123123';

  this.user = await User.create({
    email: this.email,
    password: this.password,
  });

  const generatedToken = generateToken(this.user);

  this.request = ({
    query,
    token,
    bearer,
    Authorization,
  }) => {
    const headerName = Authorization ? 'none' : 'Authorization';
    let headerValue = '';

    if (bearer === false) {
      headerValue += '';
    } else {
      headerValue += 'Bearer ';
    }

    if (token) {
      headerValue += token;
    } else {
      headerValue += generatedToken;
    }

    return requester
      .post('/')
      .send({ query })
      .set(headerName, headerValue)
      .then(r => r.body);
  };
});

// websocket connection
before(async function () {
  const GRAPHQL_ENDPOINT = `ws://localhost:${this.httpPort()}/graphql`;
  const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true,
  }, ws);

  const apolloClient = new ApolloClient({
    networkInterface: client,
    link: new WebSocketLink({
      client,
      uri: GRAPHQL_ENDPOINT,
    }),
  });

  this.apolloClient = apolloClient;
});

it.only('ws test', async function () {
  console.log(this.apolloClient);
});

after(async function () {
  await User.deleteOne({
    email: this.email,
  });
});
