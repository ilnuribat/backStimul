const http = require('http');
const { promisify } = require('util');
const mongoose = require('mongoose');
const _ = require('lodash');
const io = require('socket.io');
const Cookie = require('cookie');
const { connectToMongo } = require('../utils/connectDB');
const models = require('../main/models');
const { SOCKET_PORT } = require('../config');
const { logger } = require('../utils/logger');

const server = http.createServer();
const socketIo = io(server);

server.listenAsync = promisify(server.listen);

const ChatMessage = mongoose.model('messages', {
  username: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});


socketIo.on('connection', async (socket) => {
  const { sid } = Cookie.parse(socket.handshake.headers.cookie || '');

  if (!sid) {
    logger.debug('no sid');
    socket.disconnect();

    return;
  }

  const session = await models.Session.findOne({ where: { token: sid } });

  if (!session) {
    logger.debug('no token found in db, closing socket');
    socket.disconnect();

    return;
  }

  const user = await models.User.findOne({ where: { id: session.userId } });

  if (!user) {
    logger.debug('no user found under this session', session.id);
  }

  // показываем старые сообщения в чате
  const messagesHistory = await ChatMessage.find({});

  messagesHistory.forEach(doc => socket.emit('server:message', _.pick(doc, ['username', 'message', 'date'])));

  socket.on('client:message', async (data) => {
    logger.debug(`${user.email}: ${data.message}`);
    const dbMessage = new ChatMessage({ username: user.email, message: data.message, date: new Date() });

    await dbMessage.save();
    logger.debug('Message saved');
    socket.broadcast.emit('server:message', dbMessage);
  });

  socket.on('client:history', async () => {
    const history = await ChatMessage.find({});

    history.forEach(doc => socket.emit('server:message', _.pick(doc, ['username', 'message', 'date'])));
  });
});

module.exports = {
  name: 'chat',
  async started() {
    await connectToMongo();
    await server.listenAsync(SOCKET_PORT);
    logger.info(`Chat service started at port ${SOCKET_PORT}`);
  },
};
