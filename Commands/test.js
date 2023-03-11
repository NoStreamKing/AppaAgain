module.exports = {
    name: 'test',
    description: 'debug command',
    options: [],
    async execute(interaction) {
        interaction.reply({content: "This is a test"});
    }
  }