const { ApolloServer } = require('apollo-server');
const jsonwebtoken = require('jsonwebtoken');
const connectToMongo = require('./connectDB');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./data/models');
const { logger } = require('./logger');
const schema = require('./data/schema');
const resolvers = require('./data/resolvers');


const server = new ApolloServer({
  resolvers,
  typeDefs: schema,

  context: async ({ req = { body: {} }, res, connection = {} }) => {
    console.log({ connection });
    // console.log({ 'req.body': req.body });

    console.log(req.body.query);
    console.log(connection.query);
    const query = req.body.query || connection.query;

    console.log(query);

    if (connection) {
      // check connection for metadata
      return connection.context;
    }

    const token = req.headers.authorization;

    console.log({ token });
    const user = await User.findOne({ email: 'a' });


    return {
      user,
      ctx: {
        req,
        res,
      },
    };
  },
  subscriptions: {
    async onConnect(connectionParams) {
      const [type = '', body] = connectionParams.Authorization.split(' ');

      if (type.toLowerCase() !== 'bearer') {
        throw new Error('test');
      }

      const res = jsonwebtoken.verify(body, JWT_SECRET);

      if (!res || !res.userId) {
        throw new Error('bad payload');
      }

      const user = await User.findOne({ _id: res.userId });

      if (!user) {
        throw new Error('no user found');
      }

      console.log(user);
      console.log({ token: body });
    },
  },
});

async function start() {
  await connectToMongo();
  const listening = await server.listen({ port: HTTP_PORT });

  logger.info(`server started at port: ${listening.port}`);
}

start();
