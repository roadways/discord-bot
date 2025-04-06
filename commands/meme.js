const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'meme',
  description: 'Sends a random meme',
  async execute(message, args, client) {
    try {
      const response = await axios.get('https://meme-api.herokuapp.com/gimme');
      const data = response.data;
      
      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setColor('#FF5757')
        .setImage(data.url)
        .setFooter({ text: `👍 ${data.ups} | Subreddit: r/${data.subreddit}` })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('Could not fetch a meme at this time!');
    }
  },
};