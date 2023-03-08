// Load environment variables from .env file
require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection ,ActivityType } = require('discord.js');
const fs = require('fs');
const { checkIfUserIsLive } = require('./utils/CheckStream.js');
const { getTikTokData } = require('./utils/Tiktok.js');
const { getJSONFromFile } = require('./utils/StorageCheck.js');
const { getLatestTweet } = require('./utils/Twitter.js');
const { getLatestInstagramPost } = require('./utils/Instagram.js');

// Create a new client instance with the following intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Create a new collection to store our commands
client.commands = new Collection();

// Load all command files from the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Listen for the `ready` event
client.once(Events.ClientReady, client => {
  console.log(`Ready! Logged in as ${client.user.tag}`);


  for(cmd of client.commands) {
    data = cmd[1]
    client.application.commands.create({
      name: data.name,
      description: data.description,
      options: data.options
    });
  }

  doTiktokCheck();
  doTwitterCheck();
  doInstagramCheck();

  client.user.setActivity('Just Chillin', { type: ActivityType.Playing}, { status: 'online' });
});

// Listen for messages / Chat Commands
client.on(Events.MessageCreate, async message => {

  // loops through all files in the Chat_Commands folder
    fs.readdirSync('./Chat_Commands').forEach(file => {
      // checks if the file is a .js file
      if (file.endsWith('.js')) {
        const command = require(`./Chat_Commands/${file}`);
        // checks if the command has the run function
        if (typeof command.run === 'function') {
          let isCommand = command.isCommand;
          // checks if the command matches then runs the code
          if (message.content === `${isCommand == true ? '!' : ''}${file.slice(0, -3)}`) {
            command.run(message);
          }
        }
      }
    });

});

// Handle command execution
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;


  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
  }
});

// check every 5 minutes if twich stream is live
setInterval(() => {
  checkIfUserIsLive(client);
  doTiktokCheck();
  doTwitterCheck();

}, 5 * 60 * 1000);


function doTiktokCheck(){
  getTikTokData().then(link => {
    getJSONFromFile("Tiktok.json").then(json => {
      if(json["MRPost"] == link) return;
      json["MRPost"] = link;
  
      // send message to sepcific discord channel
  
      client.channels.cache.get('1082553714482626580').send(`**New TikTok Post**: ${link}`);
  
      fs.writeFile(`Storage/Tiktok.json`, JSON.stringify(json), (err) => {
        if (err) console.error(err);
      });
    });
  
  }).catch(error => console.error(error));
}

function doTwitterCheck(){

  getLatestTweet("itskayeteaa").then(tweet => {
    let mostRecentId = tweet.data[0].id;
    getJSONFromFile("Twitter.json").then(json => {
  
      if(json["MRTweet"] == mostRecentId) return;
      json["MRTweet"] = mostRecentId;
  
      // send message to sepcific discord channel
  
      client.channels.cache.get('1082553714482626580').send(`**New Tweet**: https://twitter.com/itskayeteaa/status/${mostRecentId}`);
  
      fs.writeFile(`Storage/Twitter.json`, JSON.stringify(json), (err) => {
        if (err) console.error(err);
      });
  
    });
  }).catch(error => console.error(error));
  

}

function doInstagramCheck(){
  getLatestInstagramPost().then(post => {
    getJSONFromFile("Instagram.json").then(json => {
      if(json["MRPhoto"] == post) return;
      json["MRPhoto"] = post;
  
      // send message to sepcific discord channel
  
      client.channels.cache.get('1082553714482626580').send(`**New Instagram Post**: https://www.instagram.com${post}`);
  
      fs.writeFile(`Storage/Instagram.json`, JSON.stringify(json), (err) => {
        if (err) console.error(err);
      });
    });
  }).catch(error => console.error(error));
}

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);