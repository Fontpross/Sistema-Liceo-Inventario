const mongoose = require('mongoose');

const N_lab = new mongoose.Schema({
    // Nombre del laboratorio (Ej: "Laboratorio 1", "Sala de Robótica")
    nombre: { 
        type: String, 
        required: [true, 'El nombre del laboratorio es obligatorio'],
        unique: true, 
        trim: true 
    },

    // Estado del laboratorio (Para poder "desactivarlo" sin borrarlo si está en remodelación)
    estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },

    // Fecha de creación
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('NumLaboratorio', N_lab);