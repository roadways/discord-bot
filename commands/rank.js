const { AttachmentBuilder } = require('discord.js');
const levels = require('../utils/levels');

module.exports = {
  name: 'rank',
  description: 'Shows your current rank and level',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);
    
    try {
      const rankCard = await levels.createRankCard(user, member, message.guild.id);
      const attachment = new AttachmentBuilder(rankCard, { name: 'rank.png' });
      
      message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while generating your rank card.');
    }
  },
};