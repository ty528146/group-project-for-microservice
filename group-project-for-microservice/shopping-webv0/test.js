var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'customer'
});
connection.connect();
//
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
     console.log('hhhh h');
 });
//
// connection.end();