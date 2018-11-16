const http = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const connectToMongo = require('./connectDB');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./src/models');
const { logger } = require('./logger');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
  context: async (args) => {
    const { req, connection } = args;

    const { context: ctx = {} } = connection || {};

    if (ctx.user) {
      return ctx;
    }

    const token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      return ctx;
    }

    let jwtBody;

    try {
      jwtBody = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      logger.debug('invalid jwt');

      throw new Error('invalid token');
    }

    const { id } = jwtBody;
    const user = await User.findById(id);


    return {
      user,
      ...ctx,
    };
  },
});

const app = express();
const server = http.createServer(app);

app.use(bodyParser());

apolloServer.applyMiddleware({ app, path: '/' });

async function start() {
  await connectToMongo();

  return new Promise((resolve/* , reject */) => {
    server.listen({ port: HTTP_PORT }, () => {
      logger.info(`server started at port: ${HTTP_PORT}`);
      resolve();
    });

    const subscriptionServer = SubscriptionServer.create({
      schema,
      execute,
      subscribe,
    }, {
      server,
      path: '/graphql',
    });

    subscriptionServer.onConnect = async (connectionParams) => {
      const [type = '', body] = connectionParams.Authorization.split(' ');

      if (type.toLowerCase() !== 'bearer') {
        throw new Error('its not bearer');
      }

      const res = jwt.verify(body, JWT_SECRET);

      if (!res || !res.id) {
        throw new Error('bad payload');
      }

      const user = await User.findById(res.id);

      if (!user) {
        throw new Error('no user found');
      }

      return user;
    };
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}


module.exports = { app };
