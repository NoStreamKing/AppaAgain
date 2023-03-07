const fs = require('fs');

exports.getJSONFromFile = async (filename) => {
    return new Promise((resolve, reject) => {
      fs.readFile(`Storage/${filename}`, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }