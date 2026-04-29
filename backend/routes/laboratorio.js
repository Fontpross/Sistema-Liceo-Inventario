const express = require('express');
const router = express.Router();
const Laboratorio = require('../models/Laboratorio'); // Aquí SÍ importas el modelo

// Ejemplo: Obtener todos los elementos del laboratorio
router.get('/', async (req, res) => {
    try {
        const items = await Laboratorio.find();
        res.json(items);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;