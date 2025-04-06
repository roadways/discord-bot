const { EmbedBuilder } = require('discord.js');
const economy = require('../utils/economy');

module.exports = {
  name: 'daily',
  description: 'Claim your daily reward',
  execute(message, args, client) {
    const userId = message.author.id;
    
    if (!economy.canGetDaily(userId)) {
      const timeLeft = economy.getTimeUntilDaily(userId);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      const embed = new EmbedBuilder()
        .setTitle('Daily Reward')
        .setColor('#FF5757')
        .setDescription(`You've already claimed your daily reward!\nCome back in **${hours}h ${minutes}m**.`)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      return message.channel.send({ embeds: [embed] });
    }
    
    const amount = economy.claimDaily(userId);
    const newBalance = economy.getBalance(userId);
    
    const embed = new EmbedBuilder()
      .setTitle('Daily Reward Claimed')
      .setColor('#00FF00')
      .setDescription(`You've claimed **${amount}** coins as your daily reward!`)
      .addFields({ name: 'New Balance', value: `💰 **${newBalance}** coins` })
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};