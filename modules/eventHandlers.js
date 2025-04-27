const { log } = require('./logger');
const { startAntiAfk, stopAntiAfk } = require('./antiAfk');
const { scheduleReconnect } = require('./reconnect');

function registerEvents(bot, botCreator) {
  bot.on('spawn', () => {
    log('[BOT] Spawned on server ✅');
    startAntiAfk(bot);
  });

  bot.on('kicked', (reason) => {
    stopAntiAfk(bot);
    let readableReason = 'Unknown kick reason';
    try {
      if (reason?.value?.extra?.value?.value?.[0]) {
        readableReason = reason.value.extra.value.value[0];
      } else if (typeof reason === 'string') {
        readableReason = reason.trim() || 'No kick reason provided';
      } else {
        readableReason = JSON.stringify(reason, null, 2);
      }
    } catch (err) {
      readableReason = 'Failed to parse kick reason';
    }
    log('[KICKED] ' + readableReason);
    scheduleReconnect(botCreator);
  });

  bot.on('error', (err) => {
    stopAntiAfk(bot);
    log('[ERROR] ' + err.toString());
    scheduleReconnect(botCreator);
  });

  bot.on('end', () => {
    stopAntiAfk(bot);
    log('[BOT] Disconnected from server');
    scheduleReconnect(botCreator);
  });
}

module.exports = { registerEvents };
