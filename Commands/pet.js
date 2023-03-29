const { feedPet } = require('../utils/Pets.js');

module.exports = {
    name: 'appa',
    description: 'Your very own pet Appa!',
    enabled: false,
    options: [
        {
            name: 'action',
            description: 'The action you want to perform on your pet Appa!.',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Feed',
                    value: 'feed'
                },
                {
                    name: 'Hydrate',
                    value: 'hydrate'
                },
                {
                    name: 'Play',
                    value: 'play'
                },
                {
                    name: 'Pet',
                    value: 'pet'
                },
                {
                    name: 'Sleep',
                    value: 'sleep'
                },
                {
                    name: 'Wake',
                    value: 'wake'
                },
                {
                    name: 'Status',
                    value: 'status'
                },
                {
                    name: 'Inventory',
                    value: 'inventory'
                },
                {
                    name: 'Shop',
                    value: 'shop'
                },
                {
                    name: 'Buy',
                    value: 'buy'
                }

            ]
        },
        {
            name: 'item',
            description: 'The item you want to use on your pet Appa!.',
            type: 3,
            required: false
        }
            
    ],
    execute(interaction) {

        // check interaction options
        const action = interaction.options.getString('action');

        if(!action) interaction.reply("Please provide an action to perform on your pet Appa!");

        switch(action) {
            case 'feed':
                const item = interaction.options.getString('item');
                const userId = interaction.user.id;
                if(!item) interaction.reply("Please provide an item to feed your pet Appa!");
                feedPet(interaction,userId, item);
            break;
        }
    
    }
  }