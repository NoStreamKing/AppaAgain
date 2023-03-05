require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance with the following intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Listen for the `ready` event
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Listen for messages
client.on(Events.MessageCreate, function(message){
  if(message.content === "yipyip"){
    message.reply("RAGRHH");
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);