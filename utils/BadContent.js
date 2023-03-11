
const fs = require('fs');



exports.getBadContent = function() {
	this.array = [];
	
	const data = fs.readFileSync('./Storage/Blacklist.json');
	const json = JSON.parse(data);

	for (const key in json) {
		this.array.push(json[key].key);
	}

	return this.array;
}