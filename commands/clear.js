const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Clears a specified number of messages',
  async execute(message, args, client) {
    // Check if user has permission to manage messages
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply('You do not have permission to use this command.');
    }
    
    // Check if amount is specified
    if (!args[0]) {
      return message.reply('Please specify the number of messages to clear!');
    }
    
    const amount = parseInt(args[0]);
    
    // Check if amount is a valid number
    if (isNaN(amount)) {
      return message.reply('Please provide a valid number!');
    }
    
    // Check if amount is between 1 and 100
    if (amount < 1 || amount > 100) {
      return message.reply('You can only clear between 1 and 100 messages at a time!');
    }
    
    try {
      // Delete messages
      const deleted = await message.channel.bulkDelete(amount, true);
      
      const embed = new EmbedBuilder()
        .setTitle('Messages Cleared')
        .setColor('#00FF00')
        .setDescription(`Successfully cleared ${deleted.size} messages.`)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      const reply = await message.channel.send({ embeds: [embed] });
      
      // Delete the confirmation message after 5 seconds
      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 5000);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while trying to clear messages. Messages older than 14 days cannot be bulk deleted.');
    }
  },
};