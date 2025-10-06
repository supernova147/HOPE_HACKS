const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: 'password',
});

// dbConnection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL');
// });

// dbConnection [TESTED CONNECTION]
//     .promise()
//     .query('SELECT * FROM personInfo')
//     .then(([rows, fields]) => {
//         console.log(rows)
//     })

module.exports = pool;

// A database connection pool is a cache of database connections maintained by an application or a dedicated middleware service. Instead of opening and closing a new database connection for each request, which can be a resource-intensive and time-consuming operation, applications can borrow a connection from the pool, use it for their database operations, and then return it to the pool for reuse by other requests
