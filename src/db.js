/* Database Connection */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); // Have to install dotenv in order to use variables inside .env file

const mysql = require("mysql2");
const fs = require ('fs');
const path = require ('path');

const pool = mysql.createPool({ // Connection to DB - changed to pool 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME, // Eddie filled this out ;)
  password: process.env.DB_PW,
}).promise(); 

module.exports = { pool };