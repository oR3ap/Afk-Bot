const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const { registerEvents } = require('./modules/eventHandlers');
const { log } = require('./modules/logger');
const { scheduleReconnect } = require('./modules/reconnect');
const { initDiscordBot, setBotTokenAndChannel } = require('./modules/discordBot');

global.isReconnecting = false;
let discordBotStarted = false;  // Flag to check if the Discord bot is already started

// SET YOUR DISCORD BOT TOKEN AND CHANNEL ID
setBotTokenAndChannel("YOUR_DISCORD_BOT_TOKEN", "YOUR_DISCORD_CHANNEL_ID");

function createMinecraftBot() {
  if (global.isReconnecting) return;
  global.isReconnecting = false;

  const bot = mineflayer.createBot({
    host: '',
    port: 25565,
    username: 'bOt',
    auth: 'offline',
    version: '1.21.4'
  });

  bot.loadPlugin(pathfinder);

  registerEvents(bot, createMinecraftBot);

  // Only initialize Discord bot once
  if (!discordBotStarted) {
    initDiscordBot(bot);
    discordBotStarted = true;  // Prevent re-initialization
  }
}

// Crash protection
process.on('uncaughtException', (err) => {
  log('[CRASH] Uncaught exception: ' + err.toString());
  scheduleReconnect(createMinecraftBot);
});

process.on('unhandledRejection', (reason, promise) => {
  log('[CRASH] Unhandled rejection: ' + reason);
  scheduleReconnect(createMinecraftBot);
});

// Start Minecraft bot
createMinecraftBot();
