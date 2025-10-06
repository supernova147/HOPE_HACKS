require ('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); // Helps db.js find .env file

// [ Testing .env Connection ]
// console.log('env Test:', {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   name: process.env.DB_NAME
// });

const mysql = require("mysql2");
const fs = require ('fs');
const path = require ('path');

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME, // Eddie filled this out ;)
  password: process.env.DB_PW,
  ssl: { 
    ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
    rejectUnauthorized: true }
});

dbConnection.connect((err) => {
    if (err) throw err;
    console.log('Connected to 1st-Party API! Hallelujah!!');
})

/*[TESTED CONNECTION]*/
dbConnection
    .promise()
    .query('SHOW TABLES;')
    .then(([rows, fields]) => {
        console.log('Tables:', rows)
    })
    .catch(err => console.error(err));

module.exports = dbConnection;