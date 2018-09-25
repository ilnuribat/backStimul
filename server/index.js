import { ApolloServer, AuthenticationError } from 'apollo-server';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';

import { typeDefs } from './data/schema';
import { mocks } from './data/mocks';
import { resolvers } from './data/resolvers';
// import { JWT_SECRET } from './config';
import { User } from './data/connectors';

let iii = 0;
const JWT_SECRET = 'key';

const PORT = 8081;

const server = new ApolloServer({
  resolvers,
  typeDefs,
  // mocks,
  context: ({ req, res, connection }) => {
    // web socket subscriptions will return a connection
    if (connection) {
      return connection.context;
    }
    const user = new Promise((resolve, reject) => {
      jwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
      })(req, res, (e) => {
        if (req.user) {
          resolve(User.findOne({ where: { id: req.user.id, version: req.user.version } }));
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
      iii++;
      console.log("User connected",iii)
      // console.log(wsContext)
      // console.log("connectionParams");
      // console.log(connectionParams);
      const userPromise = new Promise((res, rej) => {
        if (connectionParams.jwt) {
          jsonwebtoken.verify(
            connectionParams.jwt, JWT_SECRET,
            (err, decoded) => {
              if (err) {
                rej(new AuthenticationError('No token 1'));
              }
              res(User.findOne({ where: { id: decoded.id, version: decoded.version } }));
            },
          );
        } else {
          rej(new AuthenticationError('No token 2'));
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

server.listen({ port: PORT }).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
