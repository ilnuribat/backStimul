const http = require('http');
const { promisify } = require('util');
const Koa = require('koa');
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const authRouter = require('./auth');
const { HTTP_PORT } = require('../config');
const errorHandler = require('./middlewares/errorHandler');
const sessionHandler = require('./middlewares/sessionHandler');
const requestLogger = require('./middlewares/requestLogger');
const { logger } = require('../utils/logger');

const app = new Koa();
const graphqlRouter = new Router();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

graphqlRouter.all('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app
  .use(cors({ origin: '*' }))
  .use(errorHandler)
  .use(requestLogger)
  .use(bodyParser())
  .use(authRouter.routes())
  .use(sessionHandler)
  .use(graphqlRouter.routes())
  .use(graphqlRouter.allowedMethods());

const server = http.createServer(app.callback());

server.asyncListen = promisify(server.listen);

module.exports = async () => {
  await server.asyncListen(HTTP_PORT);
  logger.info(`Server is listining on port ${HTTP_PORT}`);
};
