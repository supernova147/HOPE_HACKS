const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.get('', (req, res) => {
    console.log('Server connected to the port');
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/form', (req, res) => {
    // This will be the route housing our data from MySQL
    connection.query(`SELECT * FROM ${databaseName}`, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
