var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'aasspumxgp0la9.cmrlyask3jej.us-east-1.rds.amazonaws.com',//'aa1nbfcdbxdee0h.cmrlyask3jej.us-east-1.rds.amazonaws.com',//'127.0.0.1',//'aa1nbfcdbxdee0h.cmrlyask3jej.us-east-1.rds.amazonaws.com',
    user: 'root',
    password:'Tyb112061', //'',//'Tyb112061',
    database : 'customer'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('connected!');
});
// connection.end();
module.exports = connection;