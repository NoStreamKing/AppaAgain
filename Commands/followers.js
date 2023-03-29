const axios = require('axios');
const channelName = 'kayeteaa';

const getChannelId = async () => {
    try {
      const response = await axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`
        }
      });
      return response.data.data[0].id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  const getFollowerCount = async () => {
    try {
      const channelId = await getChannelId();
      const response = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&first=1`, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`
        }
      });
      return response.data.total;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


module.exports = {
    name: 'followers',
    description: 'Get the number of followers KT has',
    enabled: true,
    options: [],
    execute(interaction) {
        getFollowerCount().then(followerCount => interaction.reply(`KT currently has ${followerCount} followers! :eyes:`)).catch(error => console.error(error));
    }
  }