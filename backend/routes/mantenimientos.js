const express = require('express'); 
const router = express.Router();   
const Mantenimientos = require('../models/Mantenimientos');
const Reportes = require('../models/Reportes');

// 1. Obtener los mantenimientos
router.get('/', async (req, res) => {
    try {
        const MTN = await Mantenimientos.find();
        res.json(MTN);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});


router.post('/', async (req, res) => {
    try {
        const { nombre_mantenimiento, estado_mantenimiento } = req.body;

        if (!nombre_mantenimiento) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio" });
        }

        if (!estado_mantenimiento) {
            return res.status(400).json({ mensaje: "El estado es obligatorio" });
        }

        const nuevoMTN = new Mantenimientos({ nombre_mantenimiento, estado_mantenimiento });
        await nuevoMTN.save();
        res.status(201).json(nuevoMTN);

    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ mensaje: "Ese nombre ya existe" });
        res.status(500).json({ mensaje: "Error al crear" });
    }
});

// 3. Actualizar por NOMBRE
router.put('/:nombreActual', async (req, res) => {
    try {
        const { nombreActual } = req.params;
        const { nuevoNombre, estado } = req.body;

        const MantenimientoActualizado = await Mantenimientos.findOneAndUpdate(
            { nombre_mantenimiento: nombreActual },
            { nombre_mantenimiento: nuevoNombre, estado_mantenimiento: estado },
            { new: true }
        );


        if (!MantenimientoActualizado) {
            return res.status(404).json({ mensaje: "Mantenimiento no encontrado" });
        }

        // Actualizar las PCs vinculadas para que no pierdan la referencia
        if (nuevoNombre && nuevoNombre !== nombreActual) {
            await Reportes.updateMany(
                { nombre_mantenimiento: nombreActual },
                { nombre_mantenimiento: nuevoNombre }
            );
        }

        res.json({ 
            mensaje: "Actualización exitosa",
            data: MantenimientoActualizado 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: "Ese nombre ya existe" });
        }
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

// 4. Eliminar por NOMBRE
router.delete('/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const MantenimientoEliminado = await Mantenimientos.findOneAndDelete({ nombre_mantenimiento: nombre });

        if (!MantenimientoEliminado) {
            return res.status(404).json({ mensaje: "No se encontró el mantenimiento" });
        }

        res.json({ mensaje: `Mantenimiento '${nombre}' eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});



module.exports = router;