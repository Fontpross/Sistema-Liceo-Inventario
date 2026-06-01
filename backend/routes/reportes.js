const express = require('express');
const router = express.Router();
const Mantenimientos = require('../models/Mantenimientos');
const Reportes = require('../models/Reportes');

// Ruta para obtener el resumen de reportes sobre el arreglo de los computadores
router.get('/', async (req, res) => {

    try {
        const reportes = await Reportes.find().populate('tipo_mantenimiento').sort({ fecha_creacion: -1 });
        res.json(reportes);

    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
        
});

// Ruta para crear un nuevo reporte de mantenimiento
router.post('/', async (req, res) => {

    try {
        const { id_articulo, nombre_articulo, estado_articulo, tipo_mantenimiento, descripcion } = req.body;

        // validacion de campos
        if (!id_articulo || !nombre_articulo || !estado_articulo || !tipo_mantenimiento || !descripcion) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        // Validacion de estado del articulo
        if (!['Activo', 'En Reparación'].includes(estado_articulo)) {
            return res.status(400).json({ mensaje: 'Estado del artículo no válido' });
        }

        // Validacion de tipo de mantenimiento y descripcion
        if (tipo_mantenimiento.trim() === '' || descripcion.trim() === '') {
            return res.status(400).json({ mensaje: 'Tipo de mantenimiento y descripción no pueden estar vacíos' });
        }

        // Validacion de longitud de descripcion
        if (descripcion.length > 500) {
            return res.status(400).json({ mensaje: 'La descripción no puede exceder los 500 caracteres' });
        }

        // Crear el nuevo reporte
        const nuevoReporte = new Reportes({
            id_articulo,
            nombre_articulo,
            estado_articulo,
            tipo_mantenimiento,
            descripcion
        });

        await nuevoReporte.save();
        res.status(201).json(nuevoReporte);

    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para actualizar un reporte existente
router.put('/:id', async (req, res) => {
    try {
        const { id_articulo, nombre_articulo, estado_articulo, tipo_mantenimiento, descripcion } = req.body;

        // Validacion de campos
        if (!id_articulo || !nombre_articulo || !estado_articulo || !tipo_mantenimiento || !descripcion) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        // Validacion de estado del articulo
        if (!['Activo', 'En Reparación'].includes(estado_articulo)) {
            return res.status(400).json({ mensaje: 'Estado del artículo no válido' });
        }

        // Validacion de tipo de mantenimiento y descripcion
        if (tipo_mantenimiento.trim() === '' || descripcion.trim() === '') {
            return res.status(400).json({ mensaje: 'Tipo de mantenimiento y descripción no pueden estar vacíos' });
        }

        // Validacion de longitud de descripcion
        if (descripcion.length > 500) {
            return res.status(400).json({ mensaje: 'La descripción no puede exceder los 500 caracteres' });
        }

        // Actualizar el reporte
        const reporteActualizado = await Reportes.findByIdAndUpdate(
            req.params.id,
            { id_articulo, nombre_articulo, estado_articulo, tipo_mantenimiento, descripcion },
            { new: true }
        );

        // Validacion de verificacion si el reporte fue encontrado y actualizado
        if (!reporteActualizado) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }

        res.json(reporteActualizado);

    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para eliminar un reporte existente
router.delete('/:id', async (req, res) => {
    try {
        const reporteEliminado = await Reportes.findByIdAndDelete(req.params.id);

        if (!reporteEliminado) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }

        res.json({ mensaje: 'Reporte eliminado correctamente' });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// Rutas para obtener datos relacionados con los reportes, como el nombre de los mantenimientos disponibles
router.get('/mantenimiento', async (req, res) => {
    try {
        const mantenimiento = await Mantenimientos.find({estado_mantenimiento: 'Activo'}).select('nombre_mantenimiento');
        res.json(mantenimiento);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});


module.exports = router;