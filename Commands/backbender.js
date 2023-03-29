module.exports = {
    name: 'backbender',
    description: 'Backbender percentage',
    enabled: true,
    options: [
        {
            name: 'user',
            description: 'The user you want to check',
            type: 6,
            required: true
        }
    ],
    execute(interaction) {
        const user = interaction.options.getUser('user');
        // send the response to the channel
        interaction.reply(`**${user.username}** is **${Math.floor(Math.random() * 100)}%** backbender :eyes:`);
    }
}