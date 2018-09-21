const { ApolloServer, AuthenticationError } = require('apollo-server');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const { typeDefs } = require('./data/schema');
const { resolvers } = require('./data/resolvers');
const { JWT_SECRET, HTTP_PORT } = require('./config');
const { User } = require('./data/models');

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req, res, connection }) => {
    // web socket subscriptions will return a connection
    if (connection) {
      // check connection for metadata
      return connection.context;
    }

    const user = new Promise((resolve, reject) => {
      // всё хранит в bearer
      jwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
      })(req, res, (e) => {
        if (req.user) {
          resolve(User.findOne({ _id: req.user.id, version: req.user.version }));
        } else {
          resolve(null);
        }
      });
    });

    return {
      user,
    };
  },
  subscriptions: {
    onConnect(connectionParams, websocket, wsContext) {
      const userPromise = new Promise((resolve, reject) => {
        if (connectionParams.jwt) {
          jsonwebtoken.verify(
            connectionParams.jwt, JWT_SECRET,
            (err, decoded) => {
              if (err) {
                reject(new AuthenticationError('No token'));
              }

              resolve(User.findOne({ _id: decoded.id, version: decoded.version }));
            },
          );
        } else {
          reject(new AuthenticationError('No token'));
        }
      });

      return userPromise.then((user) => {
        if (user) {
          return { user: Promise.resolve(user) };
        }

        return Promise.reject(new AuthenticationError('No user'));
      });
    },
  },
});

server.listen({ port: HTTP_PORT }).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
