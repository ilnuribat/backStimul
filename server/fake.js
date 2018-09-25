const { ApolloServer, PubSub } = require('apollo-server');
const connectToMongo = require('./connectDB');
const jsonwebtoken = require('jsonwebtoken');
// const { typeDefs } = require('./data/schema/index.js');
// const { resolvers } = require('./data/resolvers');
const { HTTP_PORT, JWT_SECRET } = require('./config');
const { User } = require('./data/models');
const { logger } = require('./logger');

const pubsub = new PubSub();
const BOOK_ADDED = 'BOOK_ADDED';

const booksDB = [
  {
    title: 'Work hard',
    author: 'Den',
  },
];

const server = new ApolloServer({
  resolvers: {
    Query: {
      books: (parent, args, { user }) => {
        if (!user) {
          throw new Error('no auth');
        }

        return booksDB;
      },
    },
    Mutation: {
      addBook: (root, args, ctx) => {
        console.log(ctx.user);
        booksDB.push(args);
        console.log(args);
        pubsub.publish(BOOK_ADDED, args);
      },
      async login(root, args) {
        const { email, password } = args;

        const user = await User.findOne({ email, password });

        const token = jsonwebtoken.sign({
          userId: user.id,
        }, JWT_SECRET, {
          noTimestamp: true,
        });

        return {
          user: user.email,
          token,
        };
      },
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator([BOOK_ADDED]),
      },
    },
  },
  typeDefs: `
    type Book { title: String, author: String }
    type AuthToken {
      token: String,
      user: String
    }
    type Query { books: [Book] }
    type Mutation {
      addBook(title: String, author: String): Book
      login(email: String, password: String): AuthToken
    }
    type Subscription {
      bookAdded: Book
    }
  `,

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
    async onConnect(connectionParams, websocket, wsContext) {
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
