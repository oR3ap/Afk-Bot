const { log } = require('./logger');

function scheduleReconnect(botCreator) {
  if (global.isReconnecting) return;
  global.isReconnecting = true;

  log('[BOT] Reconnecting in 10 seconds...');
  setTimeout(() => {
    global.isReconnecting = false;
    botCreator();
  }, 10 * 1000);
}

module.exports = { scheduleReconnect };
