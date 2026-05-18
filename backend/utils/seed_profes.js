const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); // Ajusta la ruta a tu modelo
require('dotenv').config();

//Funcion asincrona que ingresa un profesor para el laboratorio.
const crearProfesor = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const Profesor_lab = new Usuario({
        nombre: 'Profesor Caceres',
        rut: '22222222-2',
        email: 'Caceres@liceo.com',
        password: 'caceres123',
        rol: 'profesor_lab'
    });

    await Profesor_lab.save();
    console.log('profesor creado con éxito!');
    process.exit();
};

crearProfesor();