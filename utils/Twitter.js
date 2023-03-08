const axios = require('axios');

const endpointUrl = 'https://api.twitter.com/2/tweets';

exports.getLatestTweet = async(username) => {
        // // Construct the API request
        // const params = {
        //     'query': `from:${username}`,
        //     'max_results': 1,
        //     'tweet.fields': 'created_at'
        // };

        // // Send the request to the Twitter API v2 using Axios
        // const response = await axios.get(endpointUrl, {
        //     headers: {
        //     'Authorization': `Bearer ${process.env.TWITTER_TOKEN}`,
        //     'User-Agent': 'v2FilteredStreamJS'
        //     },
        //     params
        // });

        // // Parse the response to extract the latest tweet's ID and creation date
        // const latestTweet = response.data.data[0];
        // const tweetId = latestTweet.id;
        // const createdAt = latestTweet.created_at;

        // console.log(`The latest tweet from ${username} was posted at ${createdAt} with ID ${tweetId}.`);

}