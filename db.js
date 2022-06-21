var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(process.env.HOME + '/AppData/Local/Shikari Technologies/Shikari/main.db');
module.exports = db;