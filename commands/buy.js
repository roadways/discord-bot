const { EmbedBuilder } = require('discord.js');
const economy = require('../utils/economy');

// Define shop items (same as in shop.js)
const shopItems = [
  { id: 'vip', name: 'VIP Status', price: 5000, description: 'Get VIP status in the server' },
  { id: 'color', name: 'Custom Color', price: 2000, description: 'Get a custom color for your name' },
  { id: 'badge', name: 'Profile Badge', price: 3000, description: 'Get a special badge on your profile' },
  { id: 'lootbox', name: 'Loot Box', price: 1000, description: 'Open for a chance to get rare items' }
];

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  execute(message, args, client) {
    if (!args.length) {
      return message.reply('Please specify an item to buy! Use `!shop` to see available items.');
    }
    
    const itemId = args[0].toLowerCase();
    const item = shopItems.find(i => i.id === itemId);
    
    if (!item) {
      return message.reply('That item does not exist! Use `!shop` to see available items.');
    }
    
    const userBalance = economy.getBalance(message.author.id);
    if (userBalance < item.price) {
      return message.reply(`You don't have enough coins to buy this item! You need ${item.price - userBalance} more coins.`);
    }
    
    // Process the purchase
    const newBalance = economy.removeBalance(message.author.id, item.price);
    if (newBalance === false) {
      return message.reply('An error occurred while processing your purchase.');
    }
    
    // Add item to user's inventory
    const userData = economy.getUser(message.author.id);
    userData.inventory.push({
      id: item.id,
      name: item.name,
      purchasedAt: new Date().toISOString()
    });
    economy.saveData();
    
    // Handle special items
    if (item.id === 'vip') {
      // Try to give VIP role if it exists
      const vipRole = message.guild.roles.cache.find(role => role.name === 'VIP');
      if (vipRole) {
        message.member.roles.add(vipRole).catch(console.error);
      }
    }
    
    const embed = new EmbedBuilder()
      .setTitle('Purchase Successful')
      .setColor('#00FF00')
      .setDescription(`You have purchased **${item.name}** for 💰 **${item.price}** coins!`)
      .addFields({ name: 'New Balance', value: `💰 **${newBalance}** coins` })
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};