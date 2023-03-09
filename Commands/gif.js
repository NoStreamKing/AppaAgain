require('dotenv').config();
const { getTenorGif } = require('../utils/tenor.js');

module.exports = {
    name: 'gif',
    description: 'Gives you a random gif of appa.',
    options: [],
    execute(interaction) {

        try {
            getTenorGif().then((gifLink) => {
                interaction.reply(gifLink);
            });       
        } catch (error) {
            console.error(error);
            interaction.reply('Oops! Something went wrong while fetching the GIF.');
        }
    
    }
}