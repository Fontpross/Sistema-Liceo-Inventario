const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    id_pc: { type: String, required: true, unique: true },
    nombre_pc: { type: String, required: true, unique: true },
    numero_laboratorio: { type: String, required: true },
    profesor_cargo: { type: String, required: true },
    estado: { type: String, enum: ['Activo', 'En Reparación', 'Dañado', 'Inactivo'], default: 'Activo' },
    especificaciones: { procesador: String, ram: String, almacenamiento: String, tarjeta_grafica: String},
    
});

module.exports = mongoose.model('Laboratorio', LabSchema);