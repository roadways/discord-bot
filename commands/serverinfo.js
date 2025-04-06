const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'serverinfo',
  description: 'Shows server information',
  async execute(message, args, client) {
    const guild = message.guild;
    
    const embed = new EmbedBuilder()
      .setTitle(`Server Information - ${guild.name}`)
      .setColor('#FF5757')
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Server Name', value: guild.name, inline: true },
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Created At', value: moment(guild.createdAt).format('MMMM Do YYYY, h:mm:ss a'), inline: true },
        { name: 'Boost Level', value: `${guild.premiumTier ? `Level ${guild.premiumTier}` : 'None'}`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount || '0'}`, inline: true }
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};