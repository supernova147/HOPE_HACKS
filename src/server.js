require('dotenv').config(); // Have to install dotenv in order to use variables inside .env file
const express = require('express');
const cors = require('cors');
const {getClinics} = require('js/clinic.js');
const path = require('path');
// const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

const { pool } = require('./db');  

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

/* Routes Below */

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

app.post('/api/data', async (req, res) => { // Handler for sending data to the DB 
        
    const { //Form information from frontend
            fullnameInput, 
            phoneInput, 
            emailInput, 
            addressInput, 
            stateInput, 
            cityInput, 
            zipInput, 
            directionInput 
            } = req.body; 

        let conn;
    try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); 
// ^ If for any reason, anything is invalid beginTransac helps to prevent data from entering the DB.

    const [personResult] = await conn.execute( //inserting person info
        `INSERT INTO personInfo (fullName, phoneNum, email)
        VALUES (?, ?, ?)`, // ? acts as another defenese against SQL injections; also values are assigned in order.
        // Values will be 'translated' to a string value, preventing SQL injection;
        [fullnameInput, phoneInput || null, emailInput]
    );
    const submissionID = personResult.insertId;//foreign key so both tables can be linked

    await conn.execute( //inserting location info
        `INSERT INTO locationInfo (submissionID, address, city, state, zipcode, directions)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
        submissionID, 
        addressInput || null,
        cityInput || null,
        (stateInput || '').toUpperCase() || null, //
        zipInput || null,
        directionInput || null,
        ]
    );
    await conn.commit();
    return res.status(201).json({ ok: true, submissionID });
    } catch (err) {
    try { await conn.rollback(); } catch {}
    console.error('SERVER ERROR: ', {
        code: err.code, message: err.message, sqlMessage: err.sqlMessage, sql: err.sql, stack: err.stack
    });
    return res.status(500).json({ error: 'server', code: err.code, msg: err.sqlMessage || err.message });
    }
});

app.get('/health', (_req, res) => res.json({ok:true}));

app.get('/api/clinics', async(req,res)=> {
    try{
        const nameLike = req.query.name || undefined;
        const county = req.query.county || undefined;
        const services = req.query.services ? req.query.services.split(,).map(s => s.trim()).filter(Boolean) : [];
        const matchMode = req.query.match === 'all' ? 'all' : 'any';
        const limit = parseInt(req.query.limit, 10) || 200;
        const offset = parseInt(req.query.offset, 10) || 0;

        const data = await getClinics({nameLike, county, services, matchMode, limit, offset});
        res.json(data);
    } catch (err){
        res.status(500).json ({error: err.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});

