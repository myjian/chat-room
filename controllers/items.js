var messages = require(__dirname + '/../models/messages');

function printMsgObj(msgObj){
	var localTime = new Date(msgObj.timestamp);
	console.log("[" + localTime.toLocaleString() + "] " + msgObj.name + ": " + msgObj.msg);
}

// Save message
exports.saveMsg = function(msgObj) {
	printMsgObj(msgObj);
	messages.insert(msgObj);
};

/* Routes */
// GET /items
exports.list = function(req, res) {
	messages.list(function(err, rows) {
		res.json(rows);
	});
};
