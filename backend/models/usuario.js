const mogoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Modelo de los usuarios para poder crear cuentas de profesores y administradores
const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        enum: ['admin', 'profesor',],
        default: 'profesor',
    },
},);

// Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Forzamos que la colección se llame 'credenciales' en Compass
module.exports = mongoose.model('Usuario', UsuarioSchema, 'credenciales');