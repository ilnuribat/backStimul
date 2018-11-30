const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8500/graphql', ['graphql-ws']);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYWIzY2Y0M2YxYTA4MTMyYWUzNTIwNiIsInBhc3N3b3JkIjoicVBrT0hPd3dTTyIsImlhdCI6MTUzOTI0NjIzOH0.2N1YSGTeU0c0xf0Dyy6cVhhlvYkxX4DjQqp6M4hbHrw';

ws.on('open', () => {
  console.log('open');

  ws.send(JSON.stringify({
    type: 'connection_init',
    payload: {
      Authorization: `Bearer ${token}`,
    },
  }), (err) => {
    if (err) {
      throw err;
    }
    ws.once('message', (data) => {
      console.log('connection_ack', { data });
      ws.send(JSON.stringify({
        id: '1',
        type: 'start',
        payload: {
          variables: {},
          extensions: {},
          operationName: null,
          query: `subscription {
              messageAdded {
                id
                text
              }
            }
          `,
        },
      }), (err1) => {
        console.log('subscribe to new messages', err1);
        ws.onmessage = ({ data: dMessage }) => {
          console.log('new message', dMessage);
        };
      });
    });
  });
  console.log('closed!');
});

ws.on('close', code => console.log('close', { code }));
ws.on('error', () => console.log('error'));
ws.on('ping', () => console.log('ping'));
ws.on('pong', () => console.log('pong'));
ws.on('upgrade', () => console.log('upgrade'));
ws.on('unexpected-response', () => console.log('unexpected-response'));
