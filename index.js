'use strict';

const ChatRoom = require('./src/woospy.js');

const sessions = [
  '222b2fc8abd271d6390206f5b5300002',
  'c8ab1e037ddbfc2aeff91518a014d3db',
];


(async () => {
  const chat_1 = new ChatRoom(sessions[0]);
  const chat_2 = new ChatRoom(sessions[1]);
  const kick_all = () => {
    chat_1.leave();
    chat_2.leave();
    
    setTimeout(() => {
      chat_1.restart();
      chat_2.restart();
    }, 3000);
  };
  chat_1.handle_leave = kick_all;
  chat_2.handle_leave = kick_all;
  
  chat_1.handle_newmessage = (payload) => {
    const { data } = payload;
    console.log(`${chat_1.session} ${data.message}`);
    chat_2.send_msg(data.message);
  };
  chat_2.handle_newmessage = (payload) => {
    const { data } = payload;
    console.log(`${chat_2.session} ${data.message}`);
    chat_1.send_msg(data.message);
  };
  
  chat_1.register_listener('open', () => {
    console.log('room 1 ready, start initialize room 2...');
    chat_2.start();
  });

  chat_1.start();

})();
