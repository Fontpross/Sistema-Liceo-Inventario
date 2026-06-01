const mongoose = require('mongoose');

const Mantenimientos_lab = new mongoose.Schema({

    nombre_mantenimiento: { type: String, required: [true, 'El nombre del mantenimiento'], unique: true, trim: true },

    estado_mantenimiento: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },

    fecha_de_Creacion: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Mantenimientos', Mantenimientos_lab);