const axios = require('axios').default;
const { generateRankImage } = require('../utils/RIGenerator.js');

const API_URL = 'https://api.kyroskoh.xyz/valorant/v1/mmr/';
const VALORANT_NAME = 'backbenderappa';
const VALORANT_TAG = '1011';
const region = 'na';

module.exports = {
    name: 'rank',
    description: 'Get\'s KT\'s rank',
    options: [],
    async execute(interaction) {
        const apiURL = `${API_URL}${region}/${VALORANT_NAME}/${VALORANT_TAG}?show=rankonly&display=0`;
        try {
          const response = await axios.get(apiURL);
          generateRankImage(response.data, interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply('Failed to fetch rank data');
        }
    
    }
  }