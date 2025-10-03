require('dotenv').config(); // Have to install dotenv in order to use variables inside .env file
const express = require('express');
const cors = require('cors');
// const {getClinic} = require('../public/js/clinic');
const path = require('path');
const { match } = require('assert');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

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

app.get('/api/clinic', async (req, res) => {

});

app.get('/health', (req, res) => res.json({ok:true}));

app.get('/clinic', async (req, res) => {
  try {
    const nameLike = req.query.name || undefined;
    const county = req.query.county || undefined;
    const services = req.query.services ? req.query.services.split(',').map(s => s.trim()).filter(Boolean) : [];
    const matchMode = req.query.match === 'all' ? 'all' : 'any';
    const limit = parseInt(req.query.limit, 10) || 200;
    const offset = parseInt(req.query.offset, 10) || 0;

    const data = await getClinic({ nameLike, county, services, matchMode, limit, offset });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    // console.log(`Server running at ${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
});
