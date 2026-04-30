const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Conectar a MongoDB Compass
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Definición de Rutas (Las crearemos a continuación)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/laboratorio', require('./routes/laboratorio'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));