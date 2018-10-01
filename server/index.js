const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const connectToMongo = require('./connectDB');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./data/models');
const { logger } = require('./logger');
const schema = require('./data/schema');
const resolvers = require('./data/resolvers');
const { Message } = require('./data/models');


const server = new ApolloServer({
  resolvers,
  typeDefs: schema,

  context: async ({ req = { body: {} } }) => {
    const ctx = { };

    if (!req.headers) {
      return ctx;
    }

    const token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      return ctx;
    }

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      logger.debug('invalid jwt');

      throw new Error('invalid jwt');
    }

    const { id } = payload;
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
    },
  },
});

/* eslint-disable */
async function migrate() {
  const cursor = await Message.findOne().cursor();
  let doc = await cursor.next();

  while (doc) {
    await doc.update({
      createdAt: doc.createdAt_ || doc.createdAt,
    });

    await doc.update({
      $unset: {
        createdAt_: '',
      },
    });

    doc = await cursor.next();
  }
}
/* eslint-enable */

async function start() {
  await connectToMongo();
  const listening = await server.listen({ port: HTTP_PORT });

  logger.info(`server started at port: ${listening.port}`);

  await migrate();
}

start();
