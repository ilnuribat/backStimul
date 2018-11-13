const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const connectToMongo = require('./connectDB');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./src/models');
const { logger } = require('./logger');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');


const server = new ApolloServer({
  resolvers,
  typeDefs,
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
  subscriptions: {
    async onConnect(connectionParams, websocket, context) {
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

      Object.assign(context, { user });

      return context;
    },
  },
});

async function start() {
  await connectToMongo();
  const listening = await server.listen({ port: HTTP_PORT });

  logger.info(`server started at port: ${listening.port}`);
}

if (process.env.NODE_ENV !== 'test') {
  start();
}


module.exports = {
  server,
  start,
};
