const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bans a user from the server',
  async execute(message, args, client) {
    // Check if user has permission to ban
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('You do not have permission to use this command.');
    }
    
    // Check if a user was mentioned
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('You need to mention a user to ban!');
    }
    
    // Get member object
    const member = message.guild.members.cache.get(user.id);
    
    // Check if the bot can ban the member
    if (member && !member.bannable) {
      return message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
    }
    
    // Get reason and days of messages to delete
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    try {
      await message.guild.members.ban(user, { reason, deleteMessageDays: 7 });
      
      const embed = new EmbedBuilder()
        .setTitle('User Banned')
        .setColor('#FF0000')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Banned by', value: message.author.tag },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while trying to ban the user.');
    }
  },
};