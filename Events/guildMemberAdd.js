const welcomeSystem = require('../utils/welcome');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        // Send welcome message when a new member joins
        await welcomeSystem.sendWelcomeMessage(member, client);
    }
};