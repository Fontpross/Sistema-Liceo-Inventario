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

// 2. Funcion para poder ingresar los equipos que se utiizaran en el laboratorio
router.post('/', async (req, res) => {
    try {
        // Desestructuramos según tu esquema
        const { 
            id_pc, 
            nombre_pc, 
            Numero_laboratorio, 
            profesor_cargo, 
            estado, 
            especificaciones, // { procesador, ram, almacenamiento, serie }
            mantenimiento    // { fecha, tipo, tecnico }
        } = req.body;

        const nuevaPC = new Laboratorio({
            id_pc,
            nombre_pc,
            Numero_laboratorio,
            profesor_cargo,
            estado,
            especificaciones,
            mantenimiento
        });

        await nuevaPC.save();
        res.status(201).json(nuevaPC);
    } catch (error) {
        // Error 11000 es para campos duplicados (id_pc o nombre_pc)
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'El ID o el Nombre de la PC ya existen' });
        }
        res.status(400).json({ mensaje: 'Error al crear', detalle: error.message });
    }
});

// 3 Funcion que buscando por id_pc para realizar la actualizacion en la base de datos
router.put('/:id_pc', async (req, res) => {
    try {
        const { id_pc } = req.params; // Tomamos el ID del PC de la URL
        const datosActualizados = req.body;

        // findOneAndUpdate busca por cualquier campo del esquema
        const pcActualizada = await Laboratorio.findOneAndUpdate(
            { id_pc: id_pc }, // Criterio de búsqueda
            datosActualizados, // Datos a cambiar
            { new: true, runValidators: true }
        );

        if (!pcActualizada) {
            return res.status(404).json({ mensaje: `No se encontró la PC con ID: ${id_pc}` });
        }

        res.json(pcActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', detalle: error.message });
    }
});

// 2. Eliminar el equipo por medio del id_pc
router.delete('/:id_pc', async (req, res) => {
    try {
        const { id_pc } = req.params;
        
        const pcEliminada = await Laboratorio.findOneAndDelete({ id_pc: id_pc });

        if (!pcEliminada) {
            return res.status(404).json({ mensaje: `No se encontró la PC con ID: ${id_pc}` });
        }

        res.json({ mensaje: 'PC eliminada correctamente del inventario' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el equipo' });
    }
});

module.exports = router;