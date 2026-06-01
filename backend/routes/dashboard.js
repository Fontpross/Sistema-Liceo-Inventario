const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Lab = require('../models/Laboratorio');
const mantenimientos = require('../models/Mantenimientos');
const reportes = require('../models/Reportes');

router.get('/resumen', async (req, res) => {
    try {
        const [users, labs, mts, report] = await Promise.all([
            Usuario.countDocuments(),
            Lab.countDocuments(),
            mantenimientos.countDocuments(),
            reportes.countDocuments()
        ]);

        res.json({
            usuarios: users,
            itemsLaboratorio: labs,
            mantenimientos: mts,
            reportes: report,
            totalGlobal: labs + mts + report
        });

    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
});

module.exports = router;