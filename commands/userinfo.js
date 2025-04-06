const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'userinfo',
  description: 'Shows user information',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);
    
    const embed = new EmbedBuilder()
      .setTitle(`User Information - ${user.username}`)
      .setColor('#FF5757')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Username', value: user.username, inline: true },
        { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
        { name: 'ID', value: user.id, inline: true },
        { name: 'Joined Server', value: moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a'), inline: true },
        { name: 'Account Created', value: moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a'), inline: true },
        { name: 'Roles', value: member.roles.cache.map(role => role.toString()).join(' ').replace('@everyone', '') || 'None' }
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};