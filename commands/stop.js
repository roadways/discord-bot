const { EmbedBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  name: 'stop',
  description: 'Stops playing music and clears the queue',
  execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('You need to be in a voice channel to stop music!');
    }
    
    const queue = musicPlayer.getQueue(message.guild.id);
    if (!queue || !queue.songs.length) {
      return message.reply('There is no song playing!');
    }
    
    const stopped = musicPlayer.stop(message.guild.id);
    if (stopped) {
      const embed = new EmbedBuilder()
        .setTitle('Music Stopped')
        .setColor('#FF5757')
        .setDescription('Stopped playing music and cleared the queue.')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply('Failed to stop the music.');
    }
  },
};