const { EmbedBuilder } = require('discord.js');

// Define shop items
const shopItems = [
  { id: 'vip', name: 'VIP Status', price: 5000, description: 'Get VIP status in the server' },
  { id: 'color', name: 'Custom Color', price: 2000, description: 'Get a custom color for your name' },
  { id: 'badge', name: 'Profile Badge', price: 3000, description: 'Get a special badge on your profile' },
  { id: 'lootbox', name: 'Loot Box', price: 1000, description: 'Open for a chance to get rare items' }
];

module.exports = {
  name: 'shop',
  description: 'Shows the item shop',
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setTitle('Item Shop')
      .setColor('#FFD700')
      .setDescription('Use `!buy <item>` to purchase an item')
      .addFields(
        shopItems.map(item => ({
          name: `${item.name} - 💰 ${item.price} coins`,
          value: item.description
        }))
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};