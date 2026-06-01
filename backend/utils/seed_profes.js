const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); // Ajusta la ruta a tu modelo
require('dotenv').config();

//Funcion asincrona que ingresa un profesor para el laboratorio.
const crearProfesor = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const Profesor_lab = new Usuario({
        nombre: 'Profesor benjamin',
        rut: '21707239-5',
        email: 'Benjamin@liceo.com',
        password: 'benjamin123',
        rol: 'profesor_lab'
    });

    const Profesor_lab2 = new Usuario({
        nombre: 'Profesor Joaquin',
        rut: '21707238-5',
        email: 'Joaquin@liceo.com',
        password: 'joaquin123',
        rol: 'profesor_lab'
    });


    await Profesor_lab.save();
    await Profesor_lab2.save();
    console.log('profesores creados con éxito!');
    process.exit();
};

crearProfesor();