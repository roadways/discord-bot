const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { EmbedBuilder } = require('discord.js');

// Path to store welcome settings
const SETTINGS_PATH = path.join(__dirname, '../data/welcomeSettings.json');

// Default settings
const DEFAULT_SETTINGS = {
    enabled: false,
    channelId: null,
    message: 'Welcome to the server, {user}! We hope you enjoy your stay.',
    useImage: true,
    color: '#FF5757'
};

// Ensure the data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'));
}

// Load settings from file or create if it doesn't exist
let guildSettings = {};
try {
    if (fs.existsSync(SETTINGS_PATH)) {
        guildSettings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    } else {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify({}), 'utf8');
    }
} catch (error) {
    console.error('Error loading welcome settings:', error);
    guildSettings = {};
}

// Save settings to file
function saveSettings() {
    try {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(guildSettings, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving welcome settings:', error);
    }
}

module.exports = {
    /**
     * Get welcome settings for a guild
     * @param {string} guildId - The guild's ID
     * @returns {Object} - Guild welcome settings
     */
    getGuildSettings(guildId) {
        if (!guildSettings[guildId]) {
            guildSettings[guildId] = { ...DEFAULT_SETTINGS };
            saveSettings();
        }
        return guildSettings[guildId];
    },

    /**
     * Enable or disable the welcome system
     * @param {string} guildId - The guild's ID
     * @param {boolean} enabled - Whether to enable or disable
     */
    setEnabled(guildId, enabled) {
        const settings = this.getGuildSettings(guildId);
        settings.enabled = enabled;
        saveSettings();
    },

    /**
     * Set the welcome channel
     * @param {string} guildId - The guild's ID
     * @param {string} channelId - The channel's ID
     */
    setChannel(guildId, channelId) {
        const settings = this.getGuildSettings(guildId);
        settings.channelId = channelId;
        saveSettings();
    },

    /**
     * Set the welcome message
     * @param {string} guildId - The guild's ID
     * @param {string} message - The welcome message
     */
    setMessage(guildId, message) {
        const settings = this.getGuildSettings(guildId);
        settings.message = message;
        saveSettings();
    },

    /**
     * Enable or disable welcome images
     * @param {string} guildId - The guild's ID
     * @param {boolean} useImage - Whether to use images
     */
    setUseImage(guildId, useImage) {
        const settings = this.getGuildSettings(guildId);
        settings.useImage = useImage;
        saveSettings();
    },

    /**
     * Set the welcome image color
     * @param {string} guildId - The guild's ID
     * @param {string} color - The hex color code
     */
    setColor(guildId, color) {
        const settings = this.getGuildSettings(guildId);
        settings.color = color;
        saveSettings();
    },

    /**
     * Process placeholders in welcome message
     * @param {string} message - The message with placeholders
     * @param {Object} user - The Discord user
     * @param {Object} guild - The Discord guild
     * @returns {string} - Processed message
     */
    processMessage(message, user, guild) {
        return message
            .replace(/{user}/g, `<@${user.id}>`)
            .replace(/{username}/g, user.username)
            .replace(/{tag}/g, user.tag || user.username)
            .replace(/{server}/g, guild.name)
            .replace(/{count}/g, guild.memberCount);
    },

    /**
     * Create a welcome image
     * @param {Object} user - The Discord user
     * @param {Object} guild - The Discord guild
     * @param {string} color - The hex color
     * @returns {Buffer} - The image buffer
     */
    async createWelcomeImage(user, guild, color) {
        try {
            const canvas = createCanvas(1024, 500);
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add a semi-transparent overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw server icon if available
            if (guild.iconURL()) {
                const icon = await loadImage(guild.iconURL({ format: 'png', size: 128 }));
                ctx.drawImage(icon, 50, 50, 100, 100);
            }

            // Draw user avatar
            const avatar = await loadImage(user.displayAvatarURL({ format: 'png', size: 256 }));
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, 150, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, canvas.width / 2 - 100, 50, 200, 200);
            ctx.restore();

            // Add text
            ctx.font = '60px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('WELCOME', canvas.width / 2, 300);

            ctx.font = '40px sans-serif';
            ctx.fillText(user.username, canvas.width / 2, 350);

            ctx.font = '30px sans-serif';
            ctx.fillText(`to ${guild.name}`, canvas.width / 2, 400);

            ctx.font = '20px sans-serif';
            ctx.fillText(`Member #${guild.memberCount}`, canvas.width / 2, 440);

            return canvas.toBuffer();
        } catch (error) {
            console.error('Error creating welcome image:', error);
            return null;
        }
    },

    /**
     * Send a welcome message to a channel
     * @param {Object} member - The guild member
     * @param {Object} client - The Discord client
     */
    async sendWelcomeMessage(member, client) {
        const settings = this.getGuildSettings(member.guild.id);
        
        // Check if welcome system is enabled and channel is set
        if (!settings.enabled || !settings.channelId) return;
        
        const channel = member.guild.channels.cache.get(settings.channelId);
        if (!channel) return;
        
        // Process the welcome message
        const welcomeMessage = this.processMessage(settings.message, member.user, member.guild);
        
        // Create an embed
        const embed = new EmbedBuilder()
            .setColor(settings.color)
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setDescription(welcomeMessage)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        
        // If using images, create and send a welcome image
        if (settings.useImage) {
            try {
                const imageBuffer = await this.createWelcomeImage(member.user, member.guild, settings.color);
                if (imageBuffer) {
                    return channel.send({
                        content: `<@${member.id}>`,
                        embeds: [embed],
                        files: [{ attachment: imageBuffer, name: 'welcome.png' }]
                    });
                }
            } catch (error) {
                console.error('Error sending welcome image:', error);
            }
        }
        
        // If not using images or image creation failed, just send the embed
        return channel.send({
            content: `<@${member.id}>`,
            embeds: [embed]
        });
    }
};