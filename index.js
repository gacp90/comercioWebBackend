//Env
require('dotenv').config();
const path = require('path');

const fs = require('fs');
const axios = require('axios');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Crear el servidor express
const app = express();

// CORS
app.use(cors());

//app.use(express.bodyParser({ limit: '50mb' }));
// READ BODY
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// DIRECTORIO PUBLICO
app.use(express.static('public'));

// SPA
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.post('/log', async (req, res) => {
    const ip =
        req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    let location = {};
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        location = {
            country: response.data.country,
            city: response.data.city,
            region: response.data.regionName
        };
    } catch (error) {
        location = { country: 'unknown', city: 'unknown', region: 'unknown' };
    }

    const logEntry = {
        ip,
        timestamp,
        userAgent,
        ...location
    };

    fs.appendFile('logs.json', JSON.stringify(logEntry) + ',\n', (err) => {
        if (err) {
            console.error('Error al guardar log:', err);
            return res.status(500).json({ error: 'No se pudo guardar el log' });
        }
        res.json({ success: true });
    });
});

app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo en el Puerto', process.env.PORT);
});