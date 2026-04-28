const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    id_libro: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editorial: { type: String, required: true },
    genero: { type: String, required: true },
    año_publicacion: { type: Number, required: true },
    distribuidora: { type: String, required: true },
    disponible: { type: Boolean, default: true },
    prestamo: { fecha_prestamo: Date, fecha_devolucion: Date, rut_persona: String },
    cantidad: { type: Number, required: true, min: 0 },

});

module.exports = mongoose.model('Libro', LibroSchema);