const getTenorGif = async () => {
    const url = `https://tenor.googleapis.com/v2/search?q=appa%20avatar&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=100`;
  
    try {
      // Use a dynamic import statement to import the node-fetch library
      const fetch = await import('node-fetch');
      const response = await fetch.default(url);
      const json = await response.json();
      const gifIndex = Math.floor(Math.random() * json.results.length); // Get a random index from the search results
      const gifUrl = json.results[gifIndex].media_formats.gif.url; // Get the URL of the GIF at the random index
      return gifUrl; // Return the GIF URL
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the GIF.');
    }
  };
  

module.exports = { getTenorGif };