const mongoose = require('mongoose');

const N_lab = new mongoose.Schema({
    
    nombre: { type: String, required: [true, 'El nombre del laboratorio es obligatorio'], unique: true, trim: true },

    estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },

    fechaCreacion: { type: Date, default: Date.now }

});

module.exports = mongoose.model('NumLaboratorio', N_lab);