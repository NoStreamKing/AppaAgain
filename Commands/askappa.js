module.exports = {
    name: 'askappa',
    description: 'Ask Appa a question!',
    options: [
        {
            name: 'question',
            description: 'The question you want to ask Appa',
            type: 3,
            required: true
        }
    ],
    execute(interaction) {


        const question = interaction.options.getString('question');
        // list of magic 8 ball responses in one line
        const responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
      
        // random number between 0 and the length of the responses array
        const responseIndex = Math.floor(Math.random() * responses.length);

        // send the response to the channel
        interaction.reply(responses[responseIndex]);
    
    }
  }