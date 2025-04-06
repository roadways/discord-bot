const { EmbedBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  name: 'skip',
  description: 'Skips the current song',
  execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('You need to be in a voice channel to skip music!');
    }
    
    const queue = musicPlayer.getQueue(message.guild.id);
    if (!queue || !queue.songs.length) {
      return message.reply('There is no song playing!');
    }
    
    const skipped = musicPlayer.skip(message.guild.id);
    if (skipped) {
      const embed = new EmbedBuilder()
        .setTitle('Skipped Song')
        .setColor('#FF5757')
        .setDescription('Skipped to the next song in the queue.')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply('Failed to skip the song.');
    }
  },
};