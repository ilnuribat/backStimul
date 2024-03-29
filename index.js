const { promisify } = require('util');
const http = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { connect } = require('./connectDB');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./src/models');
const { logger } = require('./logger');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const { download } = require('./src/services/files');
const { ERROR_CODES } = require('./src/services/constants');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
  context: async (args) => {
    const { req } = args;

    const token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      return {};
    }

    let jwtBody;

    try {
      jwtBody = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return {};
    }

    const { id1C } = jwtBody;
    const user = await User.findOne({ id1C }).lean();

    if (!user) {
      return {};
    }

    user.id = user._id.toString();


    return {
      user,
    };
  },
});

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.param('id', (req, res, next, id) => {
  req.context = { id };

  return next();
});

app.get('/download/:id', (req, res) => {
  download(req.context.id)
    .then(({ stream }) => {
      stream.pipe(res);
    })
    .catch((err) => {
      res.json(err);
    });
});


const server = http.createServer(app);

app.use(bodyParser.json());

apolloServer.applyMiddleware({ app, path: '/' });

const subscriptionServer = SubscriptionServer.create({
  schema,
  execute,
  subscribe,
}, {
  server,
  path: '/graphql',
});

async function subscriptionConnectHandler(connectionParams) {
  const [type, body] = connectionParams.Authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    throw new Error('its not bearer');
  }

  const res = jwt.verify(body, JWT_SECRET);
  const user = await User.findOne({ id1C: res.id1C }).lean();

  if (!user) {
    throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
  }

  user.id = user._id;

  return { user };
}

subscriptionServer.onConnect = subscriptionConnectHandler;

async function start() {
  await connect();

  server.listenAsync = promisify(server.listen);

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    await server.listenAsync(HTTP_PORT);
    logger.info('server started at', { port: HTTP_PORT });
  }
}

start();

module.exports = {
  app,
  server,
  subscriptionConnectHandler,
};
