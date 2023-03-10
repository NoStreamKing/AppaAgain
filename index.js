// Load environment variables from .env file
require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection ,ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const { getBadContent } = require('./utils/BadContent.js');
const { checkIfUserIsLive } = require('./utils/CheckStream.js');
const { getTikTokData } = require('./utils/Tiktok.js');
const { getJSONFromFile } = require('./utils/StorageCheck.js');
const { getLatestTweet } = require('./utils/Twitter.js');
const { getLatestInstagramPost } = require('./utils/Instagram.js');
const { mentionRole } = require('./utils/Role.js');

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
  checkIfUserIsLive(client);
  doTiktokCheck();
  doTwitterCheck();
  doInstagramCheck();

  client.user.setActivity('Just Chillin', { type: ActivityType.Playing}, { status: 'online' });
});

// Listen for messages / Chat Commands
client.on(Events.MessageCreate, async message => {

  if (message.author.bot) return;

  const regex = new RegExp(getBadContent().join('|'));

  if (regex.test(message.content.toLowerCase())) {
    
    message.reply({content:"Appa has caught you being racist, please refrain from using such language in the future." , files: ["https://media.tenor.com/lhvOTFhPkkkAAAAi/cat-animation.gif"] })

    setTimeout(() => {
      message.delete();
    }, 500);
  }

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
  doInstagramCheck();

}, 5 * 60 * 1000);

function doTiktokCheck(){
  getTikTokData().then(link => {
    getJSONFromFile("Tiktok.json").then(json => {
      if(json["MRPost"] == link) return;
      json["MRPost"] = link;
  
      // send message to sepcific discord channel
      client.channels.cache.get(process.env.SOCIAL_CHANNEL_ID).send(`${mentionRole(process.env.TIKTOK_ROLE_ID)} **New TikTok Post**: ${link}`);
  
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
  
      client.channels.cache.get(process.env.SOCIAL_CHANNEL_ID).send(`${mentionRole(process.env.TWITTER_ROLE_ID)} **New Tweet**: https://twitter.com/itskayeteaa/status/${mostRecentId}`);
  
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
  
      if(post == null|| post == undefined) return;

      const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
          .setURL("https://www.instagram.com/idkkatietrinh/")
					.setLabel('❤️ Go to my Instagram ❤️')
					.setStyle(ButtonStyle.Link)
        );

      client.channels.cache.get(process.env.SOCIAL_CHANNEL_ID).send({ content: `${mentionRole(process.env.INSTAGRAM_ROLE_ID)} **New Instagram Post** ` , files: [{ attachment: post }], components: [row]});
  
      fs.writeFile(`Storage/Instagram.json`, JSON.stringify(json), (err) => {
        if (err) console.error(err);
      });
    });
  }).catch(error => console.error(error));
}

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);