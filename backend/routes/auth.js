const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator'); // Para limpiar datos

// LOGIN con protección contra inyecciones y validación
router.post('/login', [
    // 1. CAPA DE SEGURIDAD: Validamos el formato antes de tocar la DB
    body('email').isEmail().withMessage('Formato de email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
], async (req, res) => {

    const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        
    try {
        // 2. PROTECCIÓN CONTRA INYECCIÓN NOSQL:
        // Forzamos que los datos sean tratados como String puro.
        const email = String(req.body.email);
        const password = String(req.body.password);

        // Buscamos al usuario (Mongoose limpia el email al ser una búsqueda simple)
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }
        
        //Comparar las contraseñas de la base de datos, una vez validada
        //Se si es true
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        // 4. TOKEN JWT: Se definen los datos viajarán en el token
        const payload = { 
            id: usuario._id,
            nombre: usuario.nombre, 
            rol: usuario.rol 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ 
            token, 
            usuario: { 
                nombre: usuario.nombre, 
                rol: usuario.rol 
            } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
});


module.exports = router;