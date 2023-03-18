const fs = require('fs');

exports.getJSONFromFile = async (filename, Dir) => {
  Dir == undefined ? Dir = 'Storage' : Dir = Dir;
    return new Promise((resolve, reject) => {
      fs.readFile(`${Dir}/${filename}`, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
}

exports.saveJSONToFile = async (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`Storage/${filename}`, JSON.stringify(data,null, 2), (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}