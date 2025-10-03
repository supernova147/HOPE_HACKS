require('dotenv').config(); // Have to install dotenv in order to use variables inside .env file
const express = require('express');
const cors = require('cors');
const { fetchFacilities } = require('./clinic.js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('', (req, res) => {
    console.log('Server connected to the port');
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/testingmap.html'));
});

app.get('/config', (req, res) => {
    console.log('Serving API key:', process.env.MAPS_API_KEY);
    // config to use api key in html when Express serves it
    res.json({ MAPS_API_KEY: process.env.MAPS_API_KEY });
});

app.get('/form', (req, res) => {
    // This will be the route housing our data from MySQL
    connection.query(`SELECT * FROM ${databaseName}`, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/clinics', async (req, res) => {
    try {
        // console.log(req.body);
        const city = req.body.city;
        res.json(await fetchFacilities(city));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data from source' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
