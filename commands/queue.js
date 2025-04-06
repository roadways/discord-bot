const { EmbedBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  name: 'queue',
  description: 'Shows the current music queue',
  execute(message, args, client) {
    const queue = musicPlayer.getQueue(message.guild.id);
    if (!queue || !queue.songs.length) {
      return message.reply('There are no songs in the queue!');
    }
    
    const songs = queue.songs.slice(0, 10); // Show only first 10 songs
    
    const embed = new EmbedBuilder()
      .setTitle('Music Queue')
      .setColor('#FF5757')
      .setDescription(
        songs.map((song, index) => 
          `${index + 1}. [${song.title}](${song.url}) | \`${formatDuration(song.duration)}\` | Requested by: ${song.requestedBy}`
        ).join('\n')
      )
      .setFooter({ 
        text: queue.songs.length > 10 
          ? `And ${queue.songs.length - 10} more songs...` 
          : `Total songs: ${queue.songs.length}`,
        iconURL: message.author.displayAvatarURL()
      })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}