'use strict';

const WebSocket = require('ws');
const rerquest = require('request-promise');
const { header, base_url } = require('./src/fixtures');

const randomize = function() {
	return Math.floor((Math.random() * 100000) + 50000);
};

const randstr = () =>  Math.random().toString(36).substring(2,10);



(async () => {
//   const { headers } = await rerquest.get({
//     uri: base_url,
//     resolveWithFullResponse: true,
//   });
//   const session = headers['set-cookie'][0].match(/_wootalk_session=(\w+)/)[1];
//   console.log(session);
  const ws = new WebSocket('wss://wootalk.today/websocket', [], {
    headers:  Object.assign(header, {
      'Cookie': '_gat=1; _wootalk_session=' + 'c3805a7f55743513a4da7a7ef2448951' + '; _ga=GA1.2.1804571589.1429605824; __asc=6c4424fc14ce5fe7639ea11437a; __auc=c71404c914cdb259f913b23fc5b',
    }),
  });

  ws.on('open', () => {
    console.log('open');
  });

  ws.on('close', () => {
    console.log('close');
  });

  ws.on('message', (msg) => {
    const [event, payload] = JSON.parse(msg)[0];

    switch (event){
        case 'client_connected':
            break;
        case 'new_message':
            const {data} = payload;
            if (data.length && data[0].sender === 0 && data[0].leave) {
                ws.send('["change_person",{}]');
                console.log('change person');
            } else if (data.sender === 2){
                setTimeout(() => {
                    const r = ["new_message", {id: randomize(), data: {message: randstr(), msg_id: randstr()}}];
                    ws.send(JSON.stringify(r));
                }, 1000);
            }
            break;
        case 'websocket_rails.ping':
            const pong = `["websocket_rails.pong",{"id": ${randomize()},"data":{}}]`;
            ws.send(pong);
            break;
        case 'update_state':
            break;
        default:
            console.log('unsupport event', event);
    }

    console.log(msg);
  });


})();
