const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Shows user avatar',
  execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setColor('#FF5757')
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};