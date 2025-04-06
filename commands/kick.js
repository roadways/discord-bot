const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kicks a user from the server',
  async execute(message, args, client) {
    // Check if user has permission to kick
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('You do not have permission to use this command.');
    }
    
    // Check if a user was mentioned
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('You need to mention a user to kick!');
    }
    
    // Get member object
    const member = message.guild.members.cache.get(user.id);
    
    // Check if the bot can kick the member
    if (!member.kickable) {
      return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
    }
    
    // Get reason
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    try {
      await member.kick(reason);
      
      const embed = new EmbedBuilder()
        .setTitle('User Kicked')
        .setColor('#FF0000')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Kicked by', value: message.author.tag },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while trying to kick the user.');
    }
  },
};