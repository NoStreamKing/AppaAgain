// Load environment variables from .env file
require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Create a new client instance with the following intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Listen for the `ready` event
client.once(Events.ClientReady, client => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Listen for messages / Chat Commands
client.on(Events.MessageCreate, async message => {

    fs.readdirSync('./Chat_Commands').forEach(file => {
      if (file.endsWith('.js')) {
        const command = require(`./Chat_Commands/${file}`);
        if (typeof command.run === 'function') {
          let isCommand = command.isCommand;
          if (message.content === `${isCommand == true ? '!' : ''}${file.slice(0, -3)}`) {
            command.run(message);
          }
        }
      }
    });

});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
