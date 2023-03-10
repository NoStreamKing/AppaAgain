const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'List of all the commands and their descriptions for Appa',
    options: [],
    async execute(interaction) {
        let objs = [], adminObjs = [];
        // Read all the files in the commands folder
        const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../Commands/${file}`);

            // loop through required permissions and check if the user has them

            if(command.requiredPermission == undefined){
                objs.push({
                    "name": `/${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`,
                    "value": command.description
                });
            }else{
                for (const permission of command.requiredPermission) {
                    if (!interaction.member.permissions.has(permission)) continue;

                    if(adminObjs.length == 0){
                        adminObjs.push({
                            "name": `Admin Commands`,
                            "value": `These commands require certain permissions to use 👀.`
                        });
                    }

                    adminObjs.push({
                        "name": `/${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`,
                        "value": command.description + ` \n**Required Permissions:** Manage Messages`
                    });
                }
            }

        }

        objs = objs.concat(adminObjs);

        console.log(JSON.stringify(objs))

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

        interaction.reply({ embeds: [embed] ,ephemeral: true });

    }
  }