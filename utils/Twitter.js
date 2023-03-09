const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

const getLatestTweet = async () => {

};

exports.getLatestTweet = async(username) => {
    try {
      const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
          'User-Agent': 'v2RecentSearchJS',
        },
        params: {
          query: 'from:itskayeteaa -is:retweet',
          max_results: 10
        },
      });

      await console.log("Twitter has been checked");

      return response.data;
    } catch (error) {
      console.error(error);
    }

}