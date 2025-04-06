const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all available commands',
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setTitle('Bot Commands')
      .setColor('#FF5757')
      .setDescription('Here are all the available commands:')
      .addFields(
        { name: '!help', value: 'Shows this help message' },
        { name: '!ping', value: 'Checks the bot latency' },
        { name: '!avatar', value: 'Shows user avatar' },
        { name: '!userinfo', value: 'Shows user information' },
        { name: '!serverinfo', value: 'Shows server information' },
        { name: '!weather [location]', value: 'Shows weather information for a location' },
        { name: '!meme', value: 'Sends a random meme' }
      )
      .setFooter({ text: 'Bot created by @b_gan', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};