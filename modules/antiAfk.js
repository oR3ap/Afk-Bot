const { Movements, goals } = require('mineflayer-pathfinder');
const { log } = require('./logger');

function startAntiAfk(bot) {
  log('[ANTI-AFK] Anti-AFK module started ✅');

  bot._antiAfkPositionLogger = setInterval(() => {
    if (!bot?.entity?.position) return;
    const pos = bot.entity.position;
    log(`[POS] X: ${pos.x.toFixed(2)} Y: ${pos.y.toFixed(2)} Z: ${pos.z.toFixed(2)}`);
  }, 10 * 1000);

  bot._antiAfkMover = setInterval(() => {
    if (!bot?.entity?.position) return;
    const x = bot.entity.position.x + (Math.random() * 10 - 5);
    const z = bot.entity.position.z + (Math.random() * 10 - 5);
    const y = bot.entity.position.y;

    bot.pathfinder.setMovements(new Movements(bot));
    bot.pathfinder.setGoal(new goals.GoalNear(Math.floor(x), Math.floor(y), Math.floor(z), 1));
  }, 30 * 1000);
}

function stopAntiAfk(bot) {
  if (bot._antiAfkMover) clearInterval(bot._antiAfkMover);
  if (bot._antiAfkPositionLogger) clearInterval(bot._antiAfkPositionLogger);
}

module.exports = { startAntiAfk, stopAntiAfk };
