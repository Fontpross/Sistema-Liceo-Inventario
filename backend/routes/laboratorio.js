const express = require('express');
const router = express.Router();
const Laboratorio = require('../models/Laboratorio');
const Usuario = require('../models/Usuario');
const NumLaboratorio = require('../models/Nlab')

// Ejemplo: Obtener todos los elementos del laboratorio
router.get('/', async (req, res) => {
    try {
        const items = await Laboratorio.find();
        res.json(items);
        
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// 2. Funcion para poder ingresar los equipos que se utiizaran en el laboratorio
router.post('/', async (req, res) => {
    try {
        console.log("📩 BODY RECIBIDO:", req.body);
        // Desestructuramos según tu esquema
        const { 
            id_pc, 
            nombre_pc, 
            numero_laboratorio, 
            profesor_cargo, 
            estado, 
            especificaciones // { Procesador, Ram, Almacenamiento, Tarjeta Grafica }
        } = req.body;
        
        // Validaciones
        if (!id_pc || !nombre_pc || !numero_laboratorio || !profesor_cargo || !estado || !especificaciones) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        if (!['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Un equipo nuevo solo puede registrarse como Activo o Inactivo' });
        }

        // Validación de las especificaciones técnicas
        if (!especificaciones.procesador || !especificaciones.ram || !especificaciones.almacenamiento || !especificaciones.tarjeta_grafica) {
            return res.status(400).json({ mensaje: 'Especificaciones incompletas' });
        }

        if(!especificaciones.ram.match(/^\d+\s?GB$/)) {
            return res.status(400).json({ mensaje: 'La RAM debe tener un formato válido' });
        }

        if(!especificaciones.almacenamiento.match(/^\d+\s?(GB|TB)\s?SSD$/)) {
            return res.status(400).json({ mensaje: 'El almacenamiento debe tener un formato válido' });
        }

        const nuevaPC = new Laboratorio({
            id_pc,
            nombre_pc,
            numero_laboratorio,
            profesor_cargo,
            estado,
            especificaciones
        });

        await nuevaPC.save();
        res.status(201).json(nuevaPC);
    } catch (error) {
        console.log("❌ ERROR POST:", error);
        // Error 11000 es para campos duplicados (id_pc o nombre_pc)
        if (error.code === 11000) { 
            return res.status(400).json({ mensaje: 'El ID o el Nombre de la PC ya existen' });
        }
        res.status(400).json({ mensaje: 'Error al crear', detalle: error.message });
    }
});

// 3 Funcion que buscando por id_pc para realizar la actualizacion en la base de datos
router.put('/:id_pc', async (req, res) => {
    try {
        const { id_pc } = req.params; // Tomamos el ID del PC de la URL
        const datosActualizados = req.body;

        if (datosActualizados.estado) {
            const estadosPermitidos = ['Activo', 'Inactivo', 'Dañado', 'En Reparación'];
            if (!estadosPermitidos.includes(datosActualizados.estado)) {
                return res.status(400).json({ mensaje: 'El estado de actualización no es válido' });
            }
        }
        
        // findOneAndUpdate busca por cualquier campo del esquema
        const pcActualizada = await Laboratorio.findOneAndUpdate(
            { id_pc: id_pc }, // Criterio de búsqueda por el id del equipo
            datosActualizados, // Datos a cambiar
            { new: true, runValidators: true }
        );

        if (!pcActualizada) {
            return res.status(404).json({ mensaje: `No se encontró la PC con ID: ${id_pc}` });
        }

        res.json(pcActualizada);

    } catch (error) {
        console.log("❌ ERROR POST:", error);
        res.status(400).json({ mensaje: 'Error al actualizar', detalle: error.message });
    }
});

// 4. Eliminar el equipo por medio del id_pc
router.delete('/:id_pc', async (req, res) => {
    try {
        const { id_pc } = req.params;
        
        const pcEliminada = await Laboratorio.findOneAndDelete({ id_pc: id_pc });

        if (!pcEliminada) {
            return res.status(404).json({ mensaje: `No se encontró la PC con ID: ${id_pc}` });
        }

        res.json({ mensaje: 'PC eliminada correctamente del inventario' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el equipo' });
    }
});


// Get de los modulos externos como profesores y los laboratorios
router.get('/profesores', async (req, res) => {
    try {
        const profesores = await Usuario.find({rol: 'profesor_lab'}).select('nombre');
        res.json(profesores);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

router.get('/numLabs', async (req, res) => {
    try {
        const lab = await NumLaboratorio.find({estado: 'Activo'}).select('nombre');
        res.json(lab);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;