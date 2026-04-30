// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario'); // Ajusta la ruta a tu modelo
require('dotenv').config();

const crearAdminYProfesor = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = new Usuario({
        nombre: 'Administrador',
        email: 'admin@liceo.com',
        password: 'administrador123',
        rol: 'admin'
    });

    const Profesor = new Usuario({
        nombre: 'Profesor Godines',
        email: 'godines@liceo.com',
        password: 'godines123',
        rol: 'profesor'
    });

    await admin.save();
    await Profesor.save();
    console.log('¡Usuario Admin y profesor creado con éxito!');
    process.exit();
};

crearAdminYProfesor();