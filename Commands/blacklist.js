const { PermissionsBitField } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'blacklist',
    description: 'Blacklists a word from being used in the server',
    options: [
        {
            name: 'type',
            description: 'Add / Remove / List / Sync',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Add',
                    value: 'add'
                },
                {
                    name: 'Remove',
                    value: 'remove'
                },
                {
                    name: 'List',
                    value: 'list'
                }

            ]
        },
        {
            name: 'word',
            description: 'The word you want to add / remove from the blacklist',
            type: 3,
            required: false
        }
    ],
    requiredPermission: [PermissionsBitField.Flags.ManageMessages],
    execute(interaction) {

        //   //loop through required permissions and check if the user has them
        for (const permission of this.requiredPermission) {
            if (!interaction.member.permissions.has(permission)) {
                return interaction.reply({ content: `You do not have the required permissions to use this command.`, ephemeral: false });
            }
        }

        const options = interaction.options;

        // Iterate through all the options
        for (const option of options.data) {
            const optionName = option.name;
            const optionValue = option.value;
            const optionType = option.type;

            if(optionValue === 'list' && optionName === 'type') {
                let array = [];
                const data = fs.readFileSync('./Storage/Blacklist.json');
                const json = JSON.parse(data);

                for (const key in json) {
                    array.push(json[key].key);
                }

                interaction.reply({ content: "Here is a list of all the banned words: **" + array.join(", ") + "**"  ,ephemeral: true });
            }

            if(optionValue === 'add' && optionName === 'type') {

                if(!options.get('word')) return interaction.reply({ content: `You need to specify a word to add to the blacklist.`, ephemeral: true });

                const word = options.get('word').value;
                const data = fs.readFileSync('./Storage/Blacklist.json');
                const json = JSON.parse(data);

                // check if the word is already in the blacklist

                for (const key in json) {
                    if(json[key].key === word) return interaction.reply({ content: `The word ${word} is already in the blacklist.`, ephemeral: true });
                }

                const newWord = {"key": word}

                json.push(newWord);

                fs.writeFileSync('./Storage/Blacklist.json', JSON.stringify(json));

                interaction.reply({ content: `Added ${word} to the blacklist.`, ephemeral: true });
            }

            if(optionValue === 'remove' && optionName === 'type') {
            
                if(!options.get('word')) return interaction.reply({ content: `You need to specify a word to remove from the blacklist.`, ephemeral: true });

                const word = options.get('word').value;
                const data = fs.readFileSync('./Storage/Blacklist.json');
                const json = JSON.parse(data);

                // check if the word is already in the blacklist

                for (const key in json) {
                    if(json[key].key === word) {
                        json.splice(key, 1);
                        fs.writeFileSync('./Storage/Blacklist.json', JSON.stringify(json));
                        return interaction.reply({ content: `Removed ${word} from the blacklist.`, ephemeral: true });
                    }
                }

                interaction.reply({ content: `The word ${word} is not in the blacklist.`, ephemeral: true });

            }
        }

    }
}