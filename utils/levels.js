// You might need to install this package if you haven't already
// npm install discord-xp
const Levels = require('discord-xp');
const { Collection } = require('discord.js');

// Store cooldowns for XP
const cooldowns = new Collection();
const COOLDOWN_DURATION = 60000; // 1 minute cooldown

module.exports = {
    /**
     * Check if a user can get XP (not on cooldown)
     * @param {string} userId - The user's ID
     * @returns {boolean} - Whether the user can get XP
     */
    canGetXp(userId) {
        if (!cooldowns.has(userId)) return true;
        
        const expirationTime = cooldowns.get(userId);
        return Date.now() >= expirationTime;
    },
    
    /**
     * Set XP cooldown for a user
     * @param {string} userId - The user's ID
     */
    setXpCooldown(userId) {
        cooldowns.set(userId, Date.now() + COOLDOWN_DURATION);
    },
    
    /**
     * Add XP to a user
     * @param {string} userId - The user's ID
     * @param {string} guildId - The guild's ID
     * @param {number} xpToAdd - Amount of XP to add
     * @returns {Object} - Result containing leveledUp and newLevel if leveled up
     */
    async addXp(userId, guildId, xpToAdd) {
        try {
            const user = await Levels.fetch(userId, guildId, true);
            const oldLevel = user ? user.level : 0;
            
            // If user doesn't exist in the database, create them
            if (!user) {
                await Levels.createUser(userId, guildId);
            }
            
            // Add XP to the user
            const updatedUser = await Levels.appendXp(userId, guildId, xpToAdd);
            
            // Check if user leveled up
            if (updatedUser.level > oldLevel) {
                return {
                    leveledUp: true,
                    newLevel: updatedUser.level
                };
            }
            
            return { leveledUp: false };
        } catch (error) {
            console.error('Error adding XP:', error);
            return { leveledUp: false, error };
        }
    },
    
    /**
     * Fetch leaderboard for a guild
     * @param {string} guildId - The guild's ID
     * @param {number} limit - Number of users to fetch
     * @returns {Array} - Computed leaderboard
     */
    async fetchLeaderboard(guildId, limit = 10) {
        const rawLeaderboard = await Levels.fetchLeaderboard(guildId, limit);
        
        if (rawLeaderboard.length < 1) {
            return [];
        }
        
        return Levels.computeLeaderboard(client, rawLeaderboard, true);
    }
};