const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi(configuration);

const chapGPT = async (prompt) => {
    const response = await openai.createChatCompletion({model: "gpt-3.5-turbo",messages: [{ role: "user", content: prompt }],});
    return response["data"]["choices"][0]["message"]["content"];
};


module.exports = {
    name: 'prompt',
    description: 'Ask Appa a question!',
    options: [
        {
            name: 'question',
            description: 'The question you want to ask Appa',
            type: 3,
            required: true
        }
    ],
   async  execute(interaction) {

        // get question
        const question = interaction.options.getString('question');
        interaction.reply({content: "Thinking..."});
        let res = await chapGPT(`${question}`);
        setTimeout(() => {
            interaction.editReply({content: res});
        }, 5000);


    
    }
  }