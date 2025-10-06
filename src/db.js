/* Database Connection */
require('dotenv').config(); // Have to install dotenv in order to use variables inside .env file

const mysql = require("mysql2");

    const pool = mysql.createPool({ // Connection to DB - changed to pool 
      host: 'localhost',  
      user: 'root',  
      database: 'HopeHacks3', // Eddie filled this out ;)
      password: 'password',
    }).promise(); 

module.exports = { pool };
