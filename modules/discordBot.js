const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { log } = require('./logger');

let discordClient;
let uptimeStart = Date.now();
let channelId = ""; // <-- PUT YOUR CHANNEL ID HERE
let botToken = ""; // <-- PUT YOUR BOT TOKEN HERE

function initDiscordBot(bot) {
  if (!botToken) {
    log("[DISCORD] Bot token not provided, skipping Discord integration.");
    return;
  }

  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  discordClient.once('ready', () => {
    log(`[DISCORD] Logged in as ${discordClient.user.tag}!`);
    updateStatusLoop(bot);
  });

  discordClient.login(botToken);

  bot.on('playerJoined', (player) => {
    sendPlayerLog(player.username, "joined");
  });

  bot.on('playerLeft', (player) => {
    sendPlayerLog(player.username, "left");
  });
}

function updateStatusLoop(bot) {
  let toggle = true;

  setInterval(() => {
    if (!discordClient || !discordClient.user) return;

    if (toggle) {
      const playerCount = Object.keys(bot.players).length;
      discordClient.user.setActivity(`${playerCount} players online`, { type: 3 }); // 'Watching'
    } else {
      const uptimeMs = Date.now() - uptimeStart;
      const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const uptimeMinutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
      discordClient.user.setActivity(`Uptime: ${uptimeHours}h ${uptimeMinutes}m`, { type: 3 });
    }

    toggle = !toggle;
  }, 10000); // every 10 seconds
}

function sendPlayerLog(playerName, action) {
  if (!discordClient || !channelId) return;

  const channel = discordClient.channels.cache.get(channelId);
  if (!channel) {
    log(`[DISCORD] Channel ID invalid or not cached yet.`);
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`Player ${action}!`)
    .setDescription(`**${playerName}** has ${action} the server.`)
    .setColor(action === "joined" ? 0x00FF00 : 0xFF0000)
    .setTimestamp();

  channel.send({ embeds: [embed] });
}

function setBotTokenAndChannel(token, channel) {
  botToken = token;
  channelId = channel;
}

module.exports = { initDiscordBot, setBotTokenAndChannel };
