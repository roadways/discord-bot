const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmutes a user',
  async execute(message, args, client) {
    // Check if user has permission to manage roles
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('You do not have permission to use this command.');
    }
    
    // Check if a user was mentioned
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('You need to mention a user to unmute!');
    }
    
    // Get member object
    const member = message.guild.members.cache.get(user.id);
    
    // Check if the bot can unmute the member
    if (!member.moderatable) {
      return message.reply('I cannot unmute this user! Do they have a higher role? Do I have the right permissions?');
    }
    
    try {
      await member.timeout(null);
      
      const embed = new EmbedBuilder()
        .setTitle('User Unmuted')
        .setColor('#00FF00')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Unmuted by', value: message.author.tag }
        )
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while trying to unmute the user.');
    }
  },
};