const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'weather',
  description: 'Shows weather information for a location',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply('Please provide a location!');
    }
    
    const location = args.join(' ');
    
    try {
      // Using OpenWeatherMap API (you'll need to get an API key)
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`);
      const data = response.data;
      
      const embed = new EmbedBuilder()
        .setTitle(`Weather in ${data.name}, ${data.sys.country}`)
        .setColor('#FF5757')
        .setDescription(`**${data.weather[0].main}** - ${data.weather[0].description}`)
        .setThumbnail(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        .addFields(
          { name: 'Temperature', value: `${data.main.temp}°C`, inline: true },
          { name: 'Feels Like', value: `${data.main.feels_like}°C`, inline: true },
          { name: 'Humidity', value: `${data.main.humidity}%`, inline: true },
          { name: 'Wind Speed', value: `${data.wind.speed} m/s`, inline: true },
          { name: 'Pressure', value: `${data.main.pressure} hPa`, inline: true },
          { name: 'Visibility', value: `${data.visibility / 1000} km`, inline: true }
        )
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('Could not find weather information for that location!');
    }
  },
};