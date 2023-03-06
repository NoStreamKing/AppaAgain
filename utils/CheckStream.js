const axios = require('axios');
const {ActivityType } = require('discord.js');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const USERNAME = 'kayeteaa';

exports.checkIfUserIsLive = async (client) => {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${USERNAME}`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${process.env.TWITCH_TOKEN}` // replace with your Twitch access token
      }
    });

    const data = response.data;

    if (data.data.length > 0) {
      client.user.setPresence({
        activities: [{
          name: 'Kayeteaa',
          type: ActivityType.Streaming,
          url: 'https://www.twitch.tv/kayeteaa'
        }]
      });
    } else {
        client.user.setPresence({
            activities: [{
              name: 'Just Chillin',
              type: ActivityType.Playing
            }]
          });
    }
  } catch (error) {
    console.log(error);
  }
}
