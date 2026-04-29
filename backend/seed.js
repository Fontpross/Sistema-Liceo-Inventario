// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario'); // Ajusta la ruta a tu modelo
require('dotenv').config();

const crearAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const passwordHashed = await bcrypt.hash('administrador123', 10);

    const admin = new Usuario({
        nombre: 'Administrador',
        email: 'admin@liceo.com',
        password: passwordHashed,
        rol: 'admin'
    });

    await admin.save();
    console.log('¡Usuario Admin creado con éxito!');
    process.exit();
};

crearAdmin();