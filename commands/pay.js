const { EmbedBuilder } = require('discord.js');
const economy = require('../utils/economy');

module.exports = {
  name: 'pay',
  description: 'Pay coins to another user',
  execute(message, args, client) {
    const recipient = message.mentions.users.first();
    if (!recipient) {
      return message.reply('You need to mention a user to pay!');
    }
    
    if (recipient.id === message.author.id) {
      return message.reply('You cannot pay yourself!');
    }
    
    if (!args[1] || isNaN(args[1])) {
      return message.reply('Please specify a valid amount to pay!');
    }
    
    const amount = parseInt(args[1]);
    if (amount <= 0) {
      return message.reply('The amount must be greater than 0!');
    }
    
    const senderBalance = economy.getBalance(message.author.id);
    if (senderBalance < amount) {
      return message.reply(`You don't have enough coins! Your balance: ${senderBalance} coins`);
    }
    
    const success = economy.transferBalance(message.author.id, recipient.id, amount);
    if (!success) {
      return message.reply('Failed to transfer the coins!');
    }
    
    const embed = new EmbedBuilder()
      .setTitle('Payment Successful')
      .setColor('#00FF00')
      .setDescription(`${message.author} has paid ${recipient} **${amount}** coins!`)
      .addFields(
        { name: 'Your New Balance', value: `💰 **${economy.getBalance(message.author.id)}** coins`, inline: true },
        { name: `${recipient.username}'s New Balance`, value: `💰 **${economy.getBalance(recipient.id)}** coins`, inline: true }
      )
      .setFooter({ text: `Transaction ID: ${Date.now()}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};