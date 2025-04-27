const { log } = require('.logger');
const { EmbedBuilder } = require('discord.js');  Import EmbedBuilder

 Function to handle commands
async function handleCommand(message, mcBot) {
  const prefix = '!';  Define the command prefix
  if (!message.content.startsWith(prefix)  message.author.bot) return;  Ignore messages without the prefix or from bots

  const args = message.content.slice(prefix.length).trim().split( +);  Split the message into arguments
  const command = args.shift().toLowerCase();  Get the command name

  switch (command) {
    case 'statusinfo'
      log('[COMMAND] StatusInfo command received.');
      const status = getServerStatus(mcBot);
      const statusEmbed = formatServerStatus(status);
      await message.channel.send({ embeds [statusEmbed] });  Send the status embed to the channel
      break;

    default
      log(`[COMMAND] Unknown command ${command}`);
      await message.channel.send('Unknown command.');  Reply with an error message
      break;
  }
}

 Get server status
function getServerStatus(mcBot) {
   If mcBot is not defined, return a default status
  if (!mcBot) {
    log('[ERROR] mcBot is undefined.');
    return {
      online false,
      players 0,
      uptime 0,
      ramUsage 0,
      tps 0,
      laggiestChunk 'NA',
    };
  }

   SAFELY check for mcBot.players before trying to access it
  let players = 0;
  if (mcBot.players && typeof mcBot.players === 'object') {
    players = Object.keys(mcBot.players).length;
  }

   If mcBot has a property for uptime start, calculate uptime
  const uptime = mcBot.uptimeStart  Math.floor((Date.now() - mcBot.uptimeStart)  1000)  0;
  
  const ramUsage = process.memoryUsage().heapUsed  1024  1024;  RAM usage in MB
  const tps = mcBot.getTps  mcBot.getTps()  'NA';  Assuming you have a method to get TPS
  const laggiestChunk = getLaggingChunk(mcBot);  Implement this function to find the laggiest chunk

  return {
    online true,  Assuming the server is online
    players,  Safely return players count (default to 0 if undefined)
    uptime,
    ramUsage,
    tps,
    laggiestChunk,
  };
}

 Format server status for Discord message as an embed
function formatServerStatus(status) {
  const embed = new EmbedBuilder()
    .setColor(status.online  0x00FF00  0xFF0000)  Green if online, red if offline
    .setTitle('Server Status')
    .setTimestamp();

  if (status.online) {
    embed.addFields(
      { name 'Online', value 'Yes', inline true },
      { name 'Players', value `${status.players}`, inline true },
      { name 'Uptime', value `${status.uptime} seconds`, inline true },
      { name 'RAM Usage', value `${status.ramUsage.toFixed(2)} MB`, inline true },
      { name 'TPS', value `${status.tps}`, inline true },
      { name 'Lagging Chunk', value `${status.laggiestChunk}`, inline true }
    );
  } else {
    embed.addFields(
      { name 'Online', value 'No', inline true }
    );
  }

  return embed;
}

 Placeholder for getting the lagging chunk
function getLaggingChunk(mcBot) {
   Placeholder logic to determine the lagging chunk
   You will need to implement actual logic based on your server's performance
  return Chunk at (0, 0);  Example output
}

 Function to listen for messages in Discord
function listenForMessages(discordClient, mcBot) {
  discordClient.on('messageCreate', (message) = {
    handleCommand(message, mcBot);  Pass the message to handleCommand
  });
}

module.exports = { listenForMessages };
