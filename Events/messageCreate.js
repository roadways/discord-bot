module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Get prefix from environment variables or use default
    const prefix = process.env.PREFIX || '!';
    
    // Ignore messages that don't start with the prefix
    if (!message.content.startsWith(prefix)) return;
    
    // Parse command name and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    console.log(`Command attempted: ${commandName}`); // Add this for debugging
    
    // Get the command from the collection
    const command = client.commands.get(commandName);
    
    // If command doesn't exist, return
    if (!command) return;
    
    // Execute the command
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
    }
  },
};