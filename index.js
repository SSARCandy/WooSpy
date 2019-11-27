'use strict';

const ChartRoom = require('./src/index.js');

const sessions = [
  'c3805a7f55743513a4da7a7ef2448951',
  '',
];

const randint = () => Math.floor((Math.random() * 100000) + 50000);
const randstr = () => Math.random().toString(36).substring(2,10);

function handle_onmessage(ws, payload) {
  const { data } = payload;
  if (data.length && data[0].sender === 0 && data[0].leave) {
    ws.send('["change_person",{}]');
    console.log('change person');
  } else if (data.sender === 2){
    setTimeout(() => {
      const r = ['new_message', { id: randint(), data: { message: randstr(), msg_id: randstr() } }];
      ws.send(JSON.stringify(r));
    }, 1000);
  }
}

function handle_pingpong(ws) {
  const pong = `["websocket_rails.pong",{"id": ${randint()},"data":{}}]`;
  ws.send(pong);
}

(async () => {

  const Chart_1 = new ChartRoom(sessions[0]);
  Chart_1.register_listener('open', () => {
    console.log('open');
  });

  Chart_1.register_listener('close', () => {
    console.log('close');
  });

  Chart_1.register_listener('message', (msg) => {
    const [event, payload] = JSON.parse(msg)[0];

    switch (event){
    case 'client_connected':
      break;
    case 'new_message':
      handle_onmessage(Chart_1.ws, payload);
      break;
    case 'websocket_rails.ping':
      handle_pingpong(Chart_1.ws);
      break;
    case 'update_state':
      break;
    default:
      console.log('unsupport event', event);
    }

    console.log(msg);
  });

  Chart_1.start();

})();
