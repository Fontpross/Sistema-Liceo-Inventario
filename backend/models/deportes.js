const { response } = require('express');
const mongoose = require('mongoose');


const DeporteSchema = new mongoose.Schema({
    id_articulo: { type: String, required: true, unique: true },
    articulo: { type: String, required: true }, // Ej: Balón de Fútbol
    response: { type: String, required: true }, // Ej: Profesor de Educación Física
    cantidad: { type: Number, default: 0 }, // Cantidad disponible
    prestamo: { fecha_prestamo: Date, fecha_devolucion: Date, rut_persona: String },

});

module.exports = mongoose.model('Deporte', DeporteSchema);