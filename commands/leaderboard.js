const { EmbedBuilder } = require('discord.js');
const economy = require('../utils/economy');

module.exports = {
  name: 'leaderboard',
  description: 'Shows the economy leaderboard',
  async execute(message, args, client) {
    const data = economy.loadData();
    
    // Convert data to array and sort by balance
    const sortedUsers = Object.entries(data)
      .map(([userId, userData]) => ({
        id: userId,
        balance: userData.balance
      }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10); // Get top 10
    
    if (sortedUsers.length === 0) {
      return message.reply('No users found in the economy system!');
    }
    
    // Fetch user data for display
    const leaderboardPromises = sortedUsers.map(async (user, index) => {
      try {
        const discordUser = await client.users.fetch(user.id);
        return `${index + 1}. ${discordUser.tag} - 💰 **${user.balance}** coins`;
      } catch (error) {
        return `${index + 1}. Unknown User (${user.id}) - 💰 **${user.balance}** coins`;
      }
    });
    
    const leaderboardEntries = await Promise.all(leaderboardPromises);
    
    const embed = new EmbedBuilder()
      .setTitle('Economy Leaderboard')
      .setColor('#FFD700')
      .setDescription(leaderboardEntries.join('\n'))
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};