require('dotenv').config();
const WebSocket = require('ws');
const { EventEmitter } = require('events');
const { logger } = require('../logger.js');

const { token } = process.env;

class Subscriber extends EventEmitter {
  async auth() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(
        'ws://dev.scis.xyz:8500/graphql',
        ['graphql-ws'],
        {
          headers: {},
        },
      );
      const connectionErrorHandler = (code) => {
        logger.debug('connectionErrorHandler', { code });
        reject(code);
      };
      const connectionOpennedHandler = () => {
        logger.debug('connected');
        resolve(this.ws);
      };

      this.ws.on('error', connectionErrorHandler);
      this.ws.once('open', connectionOpennedHandler);
    });
  }
}

const wsClient = new Subscriber();

async function openConnect() {
  return wsClient.auth();
}

async function authorize(ws) {
  const auth = new Promise((resolve, reject) => {
    ws.send(JSON.stringify({
      type: 'connection_init',
      payload: {
        Authorization: `Bearer ${token}`,
      },
    }), (err) => {
      if (err) {
        reject(err);
      } else {
        setTimeout(
          () => reject(new Error('timeout error')),
          1000,
        );

        ws.once('message', (data) => {
          const body = JSON.parse(data);

          if (body.type === 'connection_ack') {
            resolve();
          } else if (body.type === 'connection_error') {
            reject(body.payload);
          } else {
            reject(new Error('unknown'));
          }
        });
      }
    });
  });

  return auth
    .then(() => {
      logger.debug('authorized');
    })
    .catch((err) => {
      logger.error('error: ', err);
    });
}

async function subscribeMessageAdded(ws) {
  return new Promise((resolve, reject) => {
    ws.send(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
            messageAdded {
              id
              text
              from {
                id
                username
              }
              to {
                id
                name
              }
            }
          }
        `,
      },
    }));
    ws.once('message', (data) => {
      const body = JSON.parse(data);

      if (Array.isArray(body.payload.errors)) {
        reject(body.payload.errors);
      } else {
        resolve();
      }
    });
  });
}

async function wsTest() {
  try {
    const ws = await openConnect();

    await authorize(ws);
    await subscribeMessageAdded(ws);
  } catch (err) {
    logger.error(err);
  }
}

wsTest();
