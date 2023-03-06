require('dotenv').config();
const { getTenorGif } = require('../utils/tenor.js');

exports.run = async (message) => {
  try {
    const gifLink = await getTenorGif(process.env.TENOR_API_KEY, 'cat');
    message.reply(gifLink);
  } catch (error) {
    console.error(error);
    message.reply('Oops! Something went wrong while fetching the GIF.');
  }
};

exports.isCommand = true;