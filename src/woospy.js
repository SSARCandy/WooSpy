'use strict';

const WebSocket = require('ws');
const rerquest = require('request-promise');
const { header, base_url } = require('./fixtures');

const randint = () => Math.floor((Math.random() * 100000) + 50000);
const randstr = () => Math.random().toString(36).substring(2, 10);

function handle_pingpong(ws) {
  const pong = `["websocket_rails.pong",{"id": ${randint()},"data":{}}]`;
  ws.send(pong);
}

class ChatRoom {
  constructor(session) {
    this.session = session;
    this.ws = null;
    this.listeners = [];
    this.handle_newmessage = () => { };
    this.handle_leave = () => { };
    this.register_default_listener();
  }

  register_listener(event, fn) {
    this.listeners.push({ event, fn });
  }

  // handle_leave() {
  //   setTimeout(() => {
  //     this.restart();
  //   }, 3000);
  // }

  leave() {
    this.ws.send(JSON.stringify(['change_person', {}]));
    console.log(this.session, 'change person');
  }

  register_default_listener() {
    this.register_listener('open', () => {
      console.log(this.session, 'open');
      // this.handle_leave();
    });
    this.register_listener('close', () => {
      console.log(this.session, 'close');
      // this.restart();
      setTimeout(() => {
        console.log(this.session, 'restart websocket');
        this.start();
      }, 5000);
  
    });

    this.register_listener('message', (msg) => {
      const [event, payload] = JSON.parse(msg)[0];
      const { data } = payload;

      switch (event) {
        case 'client_connected':
          break;
        case 'new_message':
          if (data.sender === 0 && data.status !== 'announce') {
            console.log(this.session, data.status, data.message);
            if (data.status === 'chat_otherleave') {
              this.handle_leave();
            }
          }
          
          if (data.length && data[0].sender === 0 && data[0].leave) {
            if (data[0].status === 'chat_otherleave') { 
              this.handle_leave();
            } else if (data[0].status === 'chat_botcheck') {
              console.log(this.session, data[0].status, data[0].message);
            }
          } else if (data.sender === 2) {
            this.handle_newmessage(payload);
          }
          break;
        case 'websocket_rails.ping':
          handle_pingpong(this.ws);
          break;
        case 'update_state':
          // console.log(event, payload);
          break;
        default:
          console.log('unsupport event', event);
          break;
      }

      // console.log(msg);
    });
  }

  send_msg(msg) {
    const r = ['new_message', { id: randint(), data: { message: msg, msg_id: randstr() } }];
    // console.log(JSON.stringify(r));
    this.ws.send(JSON.stringify(r));
  }

  start() {
    this.ws = new WebSocket('wss://wootalk.today/websocket', [], {
      headers: Object.assign(header, {
        'Cookie': '_gat=1; _wootalk_session=' + this.session + '; _ga=GA1.2.1804571589.1429605824; __asc=6c4424fc14ce5fe7639ea11437a; __auc=c71404c914cdb259f913b23fc5b',
      }),
    });

    for (let listener of this.listeners) {
      const { event, fn } = listener;
      this.ws.on(event, fn);
    }
  }

  restart() {
    this.ws.terminate();
  }
}

module.exports = ChatRoom;