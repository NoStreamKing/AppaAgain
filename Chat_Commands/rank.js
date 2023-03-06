require('dotenv').config();
const axios = require('axios').default;
const { generateRankImage } = require('../utils/RIGenerator.js');

const API_URL = 'https://api.kyroskoh.xyz/valorant/v1/mmr/';
const VALORANT_NAME = 'backbenderappa';
const VALORANT_TAG = '1011';
const region = 'na';

exports.run = async (message) => {
    const apiURL = `${API_URL}${region}/${VALORANT_NAME}/${VALORANT_TAG}?show=rankonly&display=0`;
    try {
      const response = await axios.get(apiURL);
      generateRankImage(response.data, message);
    } catch (error) {
      console.error(error);
      await message.reply('Failed to fetch rank data');
    }
};

exports.isCommand = true;