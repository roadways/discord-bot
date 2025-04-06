const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'mute',
  description: 'Mutes a user for a specified time',
  async execute(message, args, client) {
    // Check if user has permission to manage roles
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('You do not have permission to use this command.');
    }
    
    // Check if a user was mentioned
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('You need to mention a user to mute!');
    }
    
    // Get member object
    const member = message.guild.members.cache.get(user.id);
    
    // Check if the bot can mute the member
    if (!member.moderatable) {
      return message.reply('I cannot mute this user! Do they have a higher role? Do I have the right permissions?');
    }
    
    // Get duration and reason
    const durationArg = args[1];
    if (!durationArg) {
      return message.reply('You need to specify a duration! (e.g., 10s, 5m, 1h, 1d)');
    }
    
    const duration = ms(durationArg);
    if (!duration) {
      return message.reply('Please provide a valid duration! (e.g., 10s, 5m, 1h, 1d)');
    }
    
    const reason = args.slice(2).join(' ') || 'No reason provided';
    
    try {
      await member.timeout(duration, reason);
      
      const embed = new EmbedBuilder()
        .setTitle('User Muted')
        .setColor('#FF9900')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Muted by', value: message.author.tag },
          { name: 'Duration', value: durationArg },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while trying to mute the user.');
    }
  },
};