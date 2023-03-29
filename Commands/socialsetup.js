const { PermissionsBitField, ActionRowBuilder,ButtonBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'socialsetup',
    description: 'sends the social dropdown message in the channel the command is run in',
    enabled: true,
    options: [],
    requiredPermission: [PermissionsBitField.Flags.ManageRoles],
    execute(interaction) {

        // make new action row with 2 buttons
        const row = new ActionRowBuilder()
            .addComponents(
                // first button
                new ButtonBuilder()
                    .setCustomId('Subscribe')
                    .setLabel('❤️ Notify Me ❤️')
                    .setStyle(1),
            );

        // send message with action row
        interaction.reply({ content: 'Press **Notify Me** if you want to be notified when Kayeteaa updates her Socials', components: [row] });
    }
}