const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const connectToMongo = require('./connectDB');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./data/models');
const { logger } = require('./logger');
const schema = require('./data/schema');
const resolvers = require('./data/resolvers');


const server = new ApolloServer({
  resolvers,
  typeDefs: schema,

  context: async ({ req = { body: {} }, res }) => {
    const ctx = { };
    // const query = req.body.query || connection.query;

    // logger.debug(query);

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

    logger.debug(id, user);


    return {
      user,
      ...ctx,
    };
  },
  subscriptions: {
    async onConnect(connectionParams) {
      const [type = '', body] = connectionParams.Authorization.split(' ');

      if (type.toLowerCase() !== 'bearer') {
        throw new Error('test');
      }

      const res = jwt.verify(body, JWT_SECRET);

      if (!res || !res.userId) {
        throw new Error('bad payload');
      }

      const user = await User.findOne({ _id: res.userId });

      if (!user) {
        throw new Error('no user found');
      }

      logger.debug(user);
      logger.debug({ token: body });
    },
  },
});

async function start() {
  await connectToMongo();
  const listening = await server.listen({ port: HTTP_PORT });

  logger.info(`server started at port: ${listening.port}`);
}

start();
