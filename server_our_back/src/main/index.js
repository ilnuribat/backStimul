const { Service } = require('moleculer');
const { connectToPostgres } = require('../utils/connectDB');
const startHttp = require('./http');

class MainService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: 'main',
      async started() {
        await connectToPostgres();
        await startHttp();
      },
    });
  }
}

module.exports = MainService;
