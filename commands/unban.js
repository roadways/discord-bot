const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unbans a user from the server',
  async execute(message, args, client) {
    // Check if user has permission to unban
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('You do not have permission to use this command.');
    }

    // Check if a user ID was provided
    const userId = args[0];
    if (!userId) {
      return message.reply('You need to provide the user ID of the person to unban!');
    }

    try {
      // Get the user object using the ID
      const user = await client.users.fetch(userId);
      
      // Unban the user
      await message.guild.members.unban(user, { reason: args.slice(1).join(' ') || 'No reason provided' });

      const embed = new EmbedBuilder()
        .setTitle('User Unbanned')
        .setColor('#00FF00')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Unbanned by', value: message.author.tag },
          { name: 'Reason', value: args.slice(1).join(' ') || 'No reason provided' }
        )
        .setTimestamp();

      message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      message.reply('An error occurred while trying to unban the user. Ensure the user is banned and you provided a valid user ID.');
    }
  },
};