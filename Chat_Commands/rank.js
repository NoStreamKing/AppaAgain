require('dotenv').config();
const axios = require('axios').default;

const API_URL = 'https://api.kyroskoh.xyz/valorant/v1/mmr/';
const VALORANT_NAME = 'Silver';
const VALORANT_TAG = 'Sqrtr';
const region = 'na';

exports.run = async (message) => {
    const apiURL = `${API_URL}${region}/${VALORANT_NAME}/${VALORANT_TAG}?show=rankonly&display=0`;
    try {
       const response = await axios.get(apiURL);
      await message.reply(`Kayeteaa's rank is currently: ${response.data}`);
    } catch (error) {
      console.error(error);
      await message.reply('Failed to fetch rank data');
    }
};

exports.isCommand = true;