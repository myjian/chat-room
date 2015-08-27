// Database initialization
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('chat_room.sqlite3');

db.run("CREATE TABLE IF NOT EXISTS messages (timestamp INTEGER, name VARCHAR(60), msg TEXT)");

/// list(callback)
/// callback prototype must be function(err, rows)
exports.list = function(callback) {
	db.all("SELECT * FROM messages", callback);
};

exports.insert = function(msgObj) {
	var insertSQL = 'INSERT INTO messages VALUES (' + msgObj.timestamp + ', "' + msgObj.name + '", "' + msgObj.msg + '")';
	db.run(insertSQL);
};
