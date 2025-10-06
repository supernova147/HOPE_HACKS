require('dotenv').config(); // Have to install dotenv in order to use variables inside .env file
const express = require('express');
const cors = require('cors');
const fetchFacilities = require('./clinic.js');
const path = require('path');
const pool = require('./db.js');

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

app.get('/form', async (req, res) => {
    // This will be the route housing our data from MySQL
});

app.post('/clinics', async (req, res) => {
    try {
        const { city, userFilters } = req.body;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

        const facilities = await fetchFacilities(city);
        if (!facilities) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch facilities' });
        }

        let filteredFacilities = facilities;
        if (userFilters) {
            filteredFacilities = facilities.filter((facility) => {
                const attributes = facility.attributes;
                return (
                    (!userFilters.stype ||
                        attributes.stype === userFilters.stype) &&
                    (!userFilters.icf || attributes.icf === userFilters.icf) &&
                    (!userFilters.saeligible ||
                        attributes.saeligible === userFilters.saeligible)
                );
            });
        }

        res.json(filteredFacilities);
    } catch (err) {
        res.status(500).json({
            error: 'Error fetching or filtering facilities in /clinics',
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
