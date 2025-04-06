const { EmbedBuilder } = require('discord.js');
const levelSystem = require('../utils/levels');

module.exports = {
  name: 'levels',  // Make sure this line exists
  description: 'Shows the server level leaderboard',
  execute(message, args, client) {  // Make sure this function exists
    const leaderboard = levelSystem.getLeaderboard(message.guild.id);
    
    if (leaderboard.length === 0) {
      return message.reply('No one has earned XP yet!');
    }
    
    const embed = new EmbedBuilder()
      .setTitle('🏆 Level Leaderboard')
      .setColor('#FF5757')
      .setDescription('Here are the top members by level:')
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    // Add top 10 users to the leaderboard
    const top10 = leaderboard.slice(0, 10);
    
    for (let i = 0; i < top10.length; i++) {
      const user = top10[i];
      const member = message.guild.members.cache.get(user.userId);
      const username = member ? member.user.username : 'Unknown User';
      
      embed.addFields({
        name: `${i + 1}. ${username}`,
        value: `Level: ${user.level} | XP: ${user.xp}/${levelSystem.getXpNeeded(user.level)}`
      });
    }
    
    message.channel.send({ embeds: [embed] });
  },
};