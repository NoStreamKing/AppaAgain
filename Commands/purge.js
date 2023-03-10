const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Purges the chat depending on the options you choose',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to purge',
            type: 7,
            required: false
        },
        {
            name: 'user',
            description: 'The user you want to purge',
            type: 6,
            required: false
        },
        {
            name: 'time',
            description: 'The time range you want to purge in (1h, 1d, 1w, 1m, 1y)',
            type: 3,
            required: false
        }
    ],
    requiredPermission: [PermissionsBitField.Flags.ManageMessages],
    execute(interaction) {

        //loop through required permissions and check if the user has them
        for (const permission of this.requiredPermission) {
            if (!interaction.member.permissions.has(permission)) {
                return interaction.reply({ content: `You do not have the required permissions to use this command.`, ephemeral: false });
            }
        }

        const options = interaction.options;
      
        // Define the default time range as 1 day
        let timeRange = Date.now() - (24 * 60 * 60 * 1000);
      
        // Iterate through all the options
        for (const option of options.data) {
          const optionName = option.name;
          const optionValue = option.value;
          const optionType = option.type;
      
          // Handle purging of a specific channel ( Works )
          if (optionName === 'channel' && optionType === 7 && options.data.length === 1) {
            console.log('channel triggered')
            const channel = interaction.guild.channels.cache.get(optionValue);
            if (channel) {
              for(let i = 0; i < 5; i++) {
                channel.bulkDelete(100);
              }
            }
          }

          // Handle purging of a specific user ( Works )
          if (optionName === 'user' && optionType === 6 && options.data.length === 1) {
            console.log('user triggered')
            const user = interaction.guild.members.cache.get(optionValue);
            interaction.channel.messages.fetch().then((messages) => {
                // Filter messages from the specific user
                const userMessages = messages.filter((message) => message.author.id === user.id);
                // Delete the filtered messages
                interaction.channel.bulkDelete(userMessages);
              });
          }
      
          // Handle purging of a specific user in a specific channel ( Works )
          if (optionName === 'channel' && optionType === 7 && options.get('user')) {
            console.log('channel & user triggered')
            const channel = interaction.guild.channels.cache.get(optionValue);
            const userOption = options.get('user');
            const user = interaction.guild.members.cache.get(userOption.value);
            if (channel && user) {
            channel.messages.fetch().then((messages) => {
                // Filter messages from the specific user
                const userMessages = messages.filter((message) => message.author.id === user.id);
                // Delete the filtered messages
                channel.bulkDelete(userMessages);
              });
            }
          }

          // Handle purging of a channel with a specific time range ( Works )
          if (optionName === 'time' && optionType === 3 && options.get('channel')) {
            console.log('time & channel triggered')
            const channelOption = options.get('channel');
            const channel = interaction.guild.channels.cache.get(channelOption.value);
            const timeString = optionValue;
            let timeValue = parseInt(timeString.substring(0, timeString.length - 1));
            let timeUnit = timeString.substring(timeString.length - 1);
            if (!isNaN(timeValue) && ['h', 'd', 'w', 'm', 'y'].includes(timeUnit)) {
              if (timeUnit === 'h') {
                timeRange = Date.now() - (timeValue * 60 * 60 * 1000);
              } else if (timeUnit === 'd') {
                timeRange = Date.now() - (timeValue * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'w') {
                timeRange = Date.now() - (timeValue * 7 * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'm') {
                timeRange = Date.now() - (timeValue * 30 * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'y') {
                timeRange = Date.now() - (timeValue * 365 * 24 * 60 * 60 * 1000);
              }
              if (channel) {
                channel.messages.fetch({ limit: 100 }).then((messages) => {
                  const messagesToDelete = messages.filter((message) => message.createdTimestamp >= timeRange);
                  channel.bulkDelete(messagesToDelete);
                });
              }
            }
          }

          // Handle purging of a user in a specific channel with a specific time range
          if (optionName === 'time' && optionType === 3 && options.get('user')) {
            console.log('time & user triggered')
            const userOption = options.get('user');
            const user = interaction.guild.members.cache.get(userOption.value);
            const timeString = optionValue;
            let timeValue = parseInt(timeString.substring(0, timeString.length - 1));
            let timeUnit = timeString.substring(timeString.length - 1);
            if (!isNaN(timeValue) && ['h', 'd', 'w', 'm', 'y'].includes(timeUnit)) {
              if (timeUnit === 'h') {
                timeRange = Date.now() - (timeValue * 60 * 60 * 1000);
              } else if (timeUnit === 'd') {
                timeRange = Date.now() - (timeValue * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'w') {
                timeRange = Date.now() - (timeValue * 7 * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'm') {
                timeRange = Date.now() - (timeValue * 30 * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'y') {
                timeRange = Date.now() - (timeValue * 365 * 24 * 60 * 60 * 1000);
              }else{
                timeRange = null;
              }

              if (user && timeRange !== null) {
                // Iterate through all text channels in the guild
                interaction.guild.channels.cache.filter(channel => channel.type === 0).forEach(channel => {
                  // Fetch messages in the channel that were sent by the user within the time range

                  channel.messages.fetch({ limit: 100 }).then(messages => {
                      const userMessages = messages.filter(message => message.author.id === user.id && message.createdTimestamp >= timeRange);
                      // Delete messages sent by the user within the time range
                      channel.bulkDelete(userMessages).then(deletedMessages => {}).catch(error => console.error(`Failed to delete messages in ${channel.name}: ${error}`));
                    })
                    .catch(error => console.error(`Failed to fetch messages in ${channel.name}: ${error}`));
                });
              }
            }
          }
          
          // Handle purging of a user in a specific channel with a specific time range
          if (optionName === 'time' && optionType === 3 && options.get('channel') && options.get('user')) {
            console.log('time & channel & user triggered')
            const channelOption = options.get('channel');
            const channel = interaction.guild .channels.cache.get(channelOption.value);
            const userOption = options.get('user');
            const user = interaction.guild.members.cache.get(userOption.value);
            const timeString = optionValue;
            let timeValue = parseInt(timeString.substring(0, timeString.length - 1));
            let timeUnit = timeString.substring(timeString.length - 1);
            if (!isNaN(timeValue) && ['h', 'd', 'w', 'm', 'y'].includes(timeUnit)) {
              if (timeUnit === 'h') {
                timeRange = Date.now() - (timeValue * 60 * 60 * 1000);
              } else if (timeUnit === 'd') {
                timeRange = Date.now() - (timeValue * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'w') {
                timeRange = Date.now() - (timeValue * 7 * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'm') {
                timeRange = Date.now() - (timeValue * 30 * 24 * 60 * 60 * 1000);
              } else if (timeUnit === 'y') {
                timeRange = Date.now() - (timeValue * 365 * 24 * 60 * 60 * 1000);
              }
              if (channel && user) {
                channel.messages.fetch({ limit: 100 }).then((messages) => {
                  const messagesToDelete = messages.filter((message) => message.createdTimestamp >= timeRange && message.author.id === user.id);
                  channel.bulkDelete(messagesToDelete);
                });
              }
            }
          }
        }

        interaction.reply({ content: 'Purged the chat!', ephemeral: true });
          
    }
}