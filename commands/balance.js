const { EmbedBuilder } = require('discord.js');
const economy = require('../utils/economy');

module.exports = {
  name: 'balance',
  description: 'Shows your current balance',
  execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const balance = economy.getBalance(user.id);
    
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Balance`)
      .setColor('#FFD700')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setDescription(`💰 **${balance}** coins`)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};