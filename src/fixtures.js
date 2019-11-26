'use strict';

const base_url = 'https://wootalk.today';
const header = {
  'Host': 'wootalk.today',
  'Origin': 'https://wootalk.today',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Connection': 'Upgrade',
  'Upgrade': 'websocket',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
  'Sec-WebSocket-Version': 13,
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.2',
};

module.exports = {
  base_url,
  header,
};