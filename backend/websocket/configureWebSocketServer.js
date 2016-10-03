import handlers from 'websocket/handlers';

export default function configureWebSocketServer(wss) {
  global.clients = wss.clients;
  wss.on('connection', async (ws) => {
    try {
      ws.sendMessage = (data, { broadcast } = {}) => wss.clients
        .filter(w => broadcast ? w.vkid : w.vkid === ws.vkid)
        .filter(w => w.readyState === 1)
        .forEach(w => w.send(JSON.stringify(data)));

      ws.reload = () => wss.clients.forEach(w => w.close());

      let messageCount = 0;
      let lock = false;
      setInterval(() => messageCount = 0, 1000);
      ws.on('close', () => ws.vkid && global.clients.every(({ vkid }) => vkid !== ws.vkid) && ws.sendMessage({ removed_player: { vkid: ws.vkid } }, { broadcast: true }));
      ws.on('message', (d) => {
        if (global.lotteryInProgress) return;
        const data = JSON.parse(d);
        if (!ws.vkid && data.type !== 'LOGIN') return console.log('message without vkid');
        if (lock) return console.log('abort');
        if (++messageCount === 20) {
          lock = true;
        }
        try {
          console.log(`message from ${ws.vkid || 'no id'}: ${d}`);
          handlers[data.type](ws, data);
        } catch(e) { console.log(e) }
      });
    } catch(e) { console.log(e) }
  });
}
