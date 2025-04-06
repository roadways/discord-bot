const { EmbedBuilder } = require('discord.js');
const economy = require('../utils/economy');

module.exports = {
  name: 'inventory',
  description: 'Shows your inventory',
  execute(message, args, client) {
    const userData = economy.getUser(message.author.id);
    
    if (!userData.inventory || userData.inventory.length === 0) {
      return message.reply('Your inventory is empty! Use `!shop` to see items you can buy.');
    }
    
    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username}'s Inventory`)
      .setColor('#FFD700')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        userData.inventory.map(item => 
          `• **${item.name}** - Purchased on ${new Date(item.purchasedAt).toLocaleDateString()}`
        ).join('\n')
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};