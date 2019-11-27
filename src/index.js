'use strict';

const WebSocket = require('ws');
const rerquest = require('request-promise');
const { header, base_url } = require('./fixtures');


class ChartRoom {
  constructor(session) {
    this.session = session;
    this.ws = null;
    this.listeners = [];
  }

  register_listener(event, fn) {
    this.listeners.push({ event, fn });
  }

  start() {
    this.ws = new WebSocket('wss://wootalk.today/websocket', [], {
      headers:  Object.assign(header, {
        'Cookie': '_gat=1; _wootalk_session=' + 'c3805a7f55743513a4da7a7ef2448951' + '; _ga=GA1.2.1804571589.1429605824; __asc=6c4424fc14ce5fe7639ea11437a; __auc=c71404c914cdb259f913b23fc5b',
      }),
    });
    
    for (let listener of this.listeners) {
      const { event, fn } = listener;
      this.ws.on(event, fn);
    }
  }
}

module.exports = ChartRoom;