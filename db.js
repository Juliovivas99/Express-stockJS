const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'ticker'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database.");
});

module.exports = connection;