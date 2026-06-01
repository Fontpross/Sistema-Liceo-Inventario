const { response } = require('express');
const mongoose = require('mongoose');

const ReportesSchema = new mongoose.Schema({

    _id_reporte: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ID único generado automáticamente por MongoDB
    id_articulo: { type: String, required: true, unique: true }, // id o SKU del equipo obtenido
    nombre_articulo: { type: String, required: true }, // Nombre del equipo obtenido que este dañado
    estado_articulo: { type: String, enum: ['Activo', 'En Reparación'], default: 'En Reparación' },
    
    // Referencia al tipo de mantenimiento realizado, se relaciona con la colección de mantenimientos para obtener detalles del tipo de mantenimiento
    tipo_mantenimiento: { type: mongoose.Schema.Types.ObjectId, ref: 'Mantenimientos', required: true }, 
    
    descripcion: { type: String, required: true }, // Descripcion completa del mantenimiento realizado
    fecha_creacion: { type: Date, default: Date.now } // Fecha de realizacion en cuanto se ingrese el reporte sera automatica en la vista

});

module.exports = mongoose.model('Reportes', ReportesSchema);