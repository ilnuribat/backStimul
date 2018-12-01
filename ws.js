require('dotenv').config();
const WebSocket = require('ws');

const { token } = process.env;

async function openConnect() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      'ws://dev.scis.xyz:8500/graphql',
      ['graphql-ws'],
      {
        headers: {},
      },
    );

    const connectionErrorHandler = (code) => {
      console.log('connectionErrorHandler', { code });
      reject(code);
    };
    const connectionOpennedHandler = () => {
      console.log('connected');
      resolve(ws);
    };

    ws.on('error', connectionErrorHandler);
    ws.once('open', connectionOpennedHandler);
  });
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
      console.log('authorized');
    })
    .catch((err) => {
      console.error(err);
    });
}


async function test() {
  try {
    const ws = await openConnect();

    await authorize(ws);
  } catch (err) {
    console.error(err);
  }
}

test();
