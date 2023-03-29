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

const { runPetChecks } = require('./utils/Pets.js');

let userPoints = [];

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
    if(data.enabled === true){
      client.application.commands.create({
        name: data.name,
        description: data.description,
        options: data.options
      });
    }

  }
  checkIfUserIsLive(client);
  doInstagramCheck();
  doTiktokCheck();
  doTwitterCheck();

  client.user.setActivity('Just Chillin', { type: ActivityType.Playing}, { status: 'online' });
});

// Listen for messages / Chat Commands
client.on(Events.MessageCreate, async message => {

  if (message.author.bot) return;

  const regex = new RegExp(getBadContent().join('|'));

  if (regex.test(message.content.toLowerCase())) {
    
    message.reply({content:"Appa has caught you saying a bad word, please refrain from using such language in the future." , files: ["https://media.tenor.com/lhvOTFhPkkkAAAAi/cat-animation.gif"] })

    setTimeout(() => {
      message.delete();
    }, 500);
  }else{

  }

});

// Handle command execution
client.on('interactionCreate', async interaction => {

  // chec if interaction is a button click
  if(interaction.isButton() && interaction.customId === 'Subscribe') {

    // check if user has the role
    if(interaction.member.roles.cache.has(process.env.SOCIAL_ROLE_ID)) {
      
      interaction.reply({ content: 'You already have the Socials role, you will be notified when Kayeteaa updates her Socials ❤️', ephemeral: true });

    }else{
      // get the role id from the env file
      const role = interaction.guild.roles.cache.get(process.env.SOCIAL_ROLE_ID);
      // add the role to the user
      interaction.member.roles.add(role);
      // send a message to the user
      interaction.reply({ content: 'You have been added to the Socials role, you will now be notified when Kayeteaa updates her Socials ❤️', ephemeral: true });
    
    }
  }
  
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
  // addPointsToUser();
}, 5 * 60 * 1000);


function doTiktokCheck(isHeadless){
  isHeadless = isHeadless == undefined ? true : isHeadless;
  getTikTokData(isHeadless).then(link => {
    getJSONFromFile("Tiktok.json").then(json => {
      if(json["MRPost"] == link) return;
      json["MRPost"] = link;
  
      // send message to sepcific discord channel
      client.channels.cache.get(process.env.SOCIAL_CHANNEL_ID).send(`${mentionRole(process.env.SOCIAL_ROLE_ID)} **New TikTok Post**: ${link}`);
  
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
  
      client.channels.cache.get(process.env.SOCIAL_CHANNEL_ID).send(`${mentionRole(process.env.SOCIAL_ROLE_ID)} **New Tweet**: https://twitter.com/itskayeteaa/status/${mostRecentId}`);
  
      fs.writeFile(`Storage/Twitter.json`, JSON.stringify(json), (err) => {
        if (err) console.error(err);
      });
  
    });
  }).catch(error => console.error(error));
  

}

function doInstagramCheck(isHeadless){
  isHeadless = isHeadless == undefined ? true : isHeadless;
  getLatestInstagramPost(isHeadless).then(post => {
    getJSONFromFile("Instagram.json").then(json => {
      if(json["Caption"] == post.caption) return;
      json["MRPhoto"] = post.imageUrl;
      json["Caption"] = post.caption;
  
      // send message to sepcific discord channel
  
      if(post == null|| post == undefined) return;

      const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
          .setURL("https://www.instagram.com/idkkatietrinh/")
					.setLabel('❤️ Go to my Instagram ❤️')
					.setStyle(ButtonStyle.Link)
        );

      client.channels.cache.get(process.env.SOCIAL_CHANNEL_ID).send({ content: `${mentionRole(process.env.SOCIAL_ROLE_ID)} **New Instagram Post** ` , files: [{ attachment: post.imageUrl }], components: [row]});
  
      fs.writeFile(`Storage/Instagram.json`, JSON.stringify(json), (err) => {
        if (err) console.error(err);
      });
    });
  }).catch(error => console.error(error));
}

function addPointsToUser(){

  if(userPoints.length != 0){
      // get the currency.json file
      getJSONFromFile("Currency.json").then(json => {
        userPoints.forEach(user => {
          // check if Currency.json contains an object with the user id
          if(json.some(user => user.id === user.id)){
            let index = json.findIndex(user => user.id === user.id);
            json[index].points += user.points;
          }else{
            // if it doesn't, add the user to the array
            json.push({id: user.id, points: user.points});
          }
        });

        // write the new data to the file
        fs.writeFile(`Storage/Currency.json`, JSON.stringify(json), (err) => {
          if (err) console.error(err);
        });
        userPoints = [];
      });
 
  }

}

// Function: Runs all the pet checks
runPetChecks();

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);