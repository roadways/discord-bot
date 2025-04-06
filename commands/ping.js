module.exports = {
  name: 'ping',
  description: 'Checks the bot latency',
  execute(message, args, client) {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! Latency: ${timeTaken}ms. API Latency: ${Math.round(client.ws.ping)}ms`);
  },
};