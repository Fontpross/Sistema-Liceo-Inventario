const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Lab = require('../models/Laboratorio');
const Libro = require('../models/Libro');
const Deporte = require('../models/Deporte');

router.get('/resumen', async (req, res) => {
    try {
        const [users, labs, books, sports] = await Promise.all([
            Usuario.countDocuments(),
            Lab.countDocuments(),
            Libro.countDocuments(),
            Deporte.countDocuments()
        ]);

        res.json({
            usuarios: users,
            itemsLaboratorio: labs,
            totalLibros: books,
            itemsDeportes: sports,
            totalGlobal: labs + books + sports
        });
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
});

module.exports = router;