const { EmbedBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  name: 'play',
  description: 'Plays a song from YouTube',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply('You need to provide a YouTube URL or search term!');
    }
    
    if (!message.member.voice.channel) {
      return message.reply('You need to be in a voice channel to play music!');
    }
    
    const query = args.join(' ');
    let url = query;
    
    // If it's not a URL, search for it on YouTube
    if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
      try {
        const { play } = require('play-dl');
        const searched = await play.search(query, { limit: 1 });
        if (searched.length === 0) {
          return message.reply('No results found for your query!');
        }
        url = searched[0].url;
      } catch (error) {
        console.error(error);
        return message.reply('An error occurred while searching for the song.');
      }
    }
    
    const result = await musicPlayer.addSong(message, url);
    
    if (!result.success) {
      return message.reply(result.message);
    }
    
    const embed = new EmbedBuilder()
      .setTitle('Added to Queue')
      .setColor('#FF5757')
      .setDescription(`[${result.song.title}](${result.song.url})`)
      .setThumbnail(result.song.thumbnail)
      .addFields(
        { name: 'Duration', value: formatDuration(result.song.duration), inline: true },
        { name: 'Requested By', value: result.song.requestedBy, inline: true }
      )
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}