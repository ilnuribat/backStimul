const Server = require('socket.io');
const { Service } = require('moleculer');
const { logger } = require('../utils/logger');

module.exports = class SocketService extends Service {
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'socket',
      started: async () => {
        logger.warn('socket started');
        const io = new Server({
          transports: 'websocket',
        });

      },
    });
  }
};
