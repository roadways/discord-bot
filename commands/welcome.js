const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const welcomeSystem = require('../utils/welcome');

module.exports = {
  name: 'welcome',
  description: 'Configure the welcome system',
  execute(message, args, client) {
    // Check if user has admin permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need administrator permissions to use this command!');
    }
    
    if (!args.length) {
      const settings = welcomeSystem.getGuildSettings(message.guild.id);
      const embed = new EmbedBuilder()
        .setTitle('Welcome System Settings')
        .setColor(settings.color || '#FF5757')
        .addFields(
          { name: 'Status', value: settings.enabled ? 'Enabled ✅' : 'Disabled ❌', inline: true },
          { name: 'Channel', value: settings.channelId ? `<#${settings.channelId}>` : 'Not set', inline: true },
          { name: 'Use Image', value: settings.useImage ? 'Yes ✅' : 'No ❌', inline: true },
          { name: 'Welcome Message', value: settings.message || 'Default welcome message' }
        )
        .setFooter({ text: 'Use !welcome help for more information' })
        .setTimestamp();
      
      return message.channel.send({ embeds: [embed] });
    }

    const subCommand = args[0].toLowerCase();

    if (subCommand === 'help') {
      const helpEmbed = new EmbedBuilder()
        .setTitle('Welcome Command Help')
        .setColor('#FF5757')
        .setDescription('Configure the welcome system for your server')
        .addFields(
          { name: '!welcome', value: 'Show current welcome settings' },
          { name: '!welcome enable', value: 'Enable welcome messages' },
          { name: '!welcome disable', value: 'Disable welcome messages' },
          { name: '!welcome channel #channel', value: 'Set the welcome channel' },
          { name: '!welcome message [text]', value: 'Set the welcome message\nUse {user} to mention the user\n{username} for their name\n{server} for server name\n{count} for member count' },
          { name: '!welcome image on/off', value: 'Toggle welcome images' },
          { name: '!welcome color #hex', value: 'Set welcome image color' }
        )
        .setFooter({ text: 'Welcome System', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      
      return message.channel.send({ embeds: [helpEmbed] });
    }

    if (subCommand === 'enable') {
      welcomeSystem.updateGuildSettings(message.guild.id, { enabled: true });
      return message.reply('Welcome messages have been enabled! ✅');
    }

    if (subCommand === 'disable') {
      welcomeSystem.updateGuildSettings(message.guild.id, { enabled: false });
      return message.reply('Welcome messages have been disabled! ❌');
    }

    if (subCommand === 'channel') {
      const channel = message.mentions.channels.first();
      if (!channel) {
        return message.reply('Please mention a channel! Example: `!welcome channel #welcome`');
      }
      
      welcomeSystem.updateGuildSettings(message.guild.id, { channelId: channel.id });
      return message.reply(`Welcome channel set to ${channel}! ✅`);
    }

    if (subCommand === 'message') {
      const welcomeMessage = args.slice(1).join(' ');
      if (!welcomeMessage) {
        return message.reply('Please provide a welcome message! Example: `!welcome message Welcome {user} to {server}!`');
      }
      
      welcomeSystem.updateGuildSettings(message.guild.id, { message: welcomeMessage });
      
      // Show a preview of the message
      let previewMessage = welcomeMessage
        .replace(/{user}/g, `<@${message.author.id}>`)
        .replace(/{username}/g, message.author.username)
        .replace(/{server}/g, message.guild.name)
        .replace(/{count}/g, message.guild.memberCount);
      
      const previewEmbed = new EmbedBuilder()
        .setTitle('Welcome Message Updated')
        .setColor('#FF5757')
        .setDescription('Your welcome message has been updated! Here\'s a preview:')
        .addFields({ name: 'Preview', value: previewMessage })
        .setFooter({ text: 'Welcome System', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      
      return message.channel.send({ embeds: [previewEmbed] });
    }

    if (subCommand === 'image') {
      const option = args[1]?.toLowerCase();
      if (!option || (option !== 'on' && option !== 'off')) {
        return message.reply('Please specify either `on` or `off`! Example: `!welcome image on`');
      }
      
      const useImage = option === 'on';
      welcomeSystem.updateGuildSettings(message.guild.id, { useImage });
      
      return message.reply(`Welcome images have been turned ${useImage ? 'on' : 'off'}! ${useImage ? '✅' : '❌'}`);
    }

    if (subCommand === 'color') {
      const color = args[1];
      if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
        return message.reply('Please provide a valid hex color code! Example: `!welcome color #FF5757`');
      }
      
      welcomeSystem.updateGuildSettings(message.guild.id, { color });
      
      const colorEmbed = new EmbedBuilder()
        .setTitle('Welcome Color Updated')
        .setColor(color)
        .setDescription(`Welcome image color has been set to ${color}`)
        .setFooter({ text: 'Welcome System', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      
      return message.channel.send({ embeds: [colorEmbed] });
    }

    // If we get here, the subcommand wasn't recognized
    return message.reply('Unknown subcommand. Use `!welcome help` to see available options.');
  },
};