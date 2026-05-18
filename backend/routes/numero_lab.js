const express = require('express'); 
const router = express.Router();   
const NumLaboratorio = require('../models/Nlab'); 
const Equipo = require('../models/Laboratorio'); 


// 1. Obtener laboratorios
router.get('/', async (req, res) => {
    try {
        const lab = await NumLaboratorio.find();
        res.json(lab);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// 2. Crear un nuevo laboratorio
router.post('/', async (req, res) => {
    try {
        const { nombre, estado } = req.body;

        // VALIDACIÓN: Si no llega el nombre, el servidor podría fallar
        if (!nombre) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio" });
        }

        const nuevoLab = new NumLaboratorio({ nombre, estado });
        await nuevoLab.save();
        res.status(201).json(nuevoLab);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ mensaje: "Ese nombre ya existe" });
        res.status(500).json({ mensaje: "Error al crear" });
    }
});

// 3. Eliminar por NOMBRE
router.delete('/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const labEliminado = await NumLaboratorio.findOneAndDelete({ nombre: nombre });

        if (!labEliminado) {
            return res.status(404).json({ mensaje: "No se encontró el laboratorio" });
        }

        res.json({ mensaje: `Laboratorio '${nombre}' eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

// 4. Actualizar por NOMBRE
router.put('/:nombreActual', async (req, res) => {
    try {
        const { nombreActual } = req.params;
        const { nuevoNombre, estado } = req.body;

        const labActualizado = await NumLaboratorio.findOneAndUpdate(
            { nombre: nombreActual },
            { nombre: nuevoNombre, estado: estado },
            { new: true }
        );

        if (!labActualizado) {
            return res.status(404).json({ mensaje: "Laboratorio no encontrado" });
        }

        // Actualizar las PCs vinculadas para que no pierdan la referencia
        if (nuevoNombre && nuevoNombre !== nombreActual) {
            await Equipo.updateMany(
                { numero_laboratorio: nombreActual },
                { numero_laboratorio: nuevoNombre }
            );
        }

        res.json({ 
            mensaje: "Actualización exitosa",
            data: labActualizado 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

module.exports = router;