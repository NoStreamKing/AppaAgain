const fs = require('fs');

let objs = [];

module.exports = {
    name: 'help',
    description: 'List of all the commands and their descriptions for Appa',
    options: [],
    async execute(interaction) {
        objs = []
        // Read all the files in the commands folder
        const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../Commands/${file}`);

            objs.push({
                "name": `/${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`,
                "value": command.description
            });
        }

        // messageembed
        const embed = {
            "title": "Appa's Commands",
            "description": "Here are all the commands that Appa can do!",
            "image": {
                "url": "https://i.imgur.com/ORcfabE.png"
            },
            "color": 16657494,
            "fields": objs
        };

        interaction.reply({ embeds: [embed] });

    }
  }