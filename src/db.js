const mysql = require("mysql2");

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: , // Eddie fill this out
  password: 'password'
});

dbConnection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
})

module.exports = dbConnection;