const mysql = require('mysql2');

const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'instant',
  password: 'instant',
};

const dbConnection = mysql.createConnection(config).promise();

module.exports = { dbConnection };
