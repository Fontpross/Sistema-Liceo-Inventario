import React, { useState, useEffect } from 'react';
import { X, Save, Cpu, Database, HardDrive, Monitor } from 'lucide-react';
import { ApiRestLab } from '../../Config/api'; // Importamos tu URL base
import Swal from 'sweetalert2';

const LaboratorioModal = ({ isOpen, onClose, onSave, equipoEditar }) => {
  // Estado inicial del formulario siguiendo tu esquema de MongoDB
  const [profesores, setProfesores] = useState([]);
  const [labs, setLabs] = useState([]);
  const [formData, setFormData] = useState({
    id_pc: '',
    nombre_pc: '',
    numero_laboratorio: '',
    profesor_cargo: '',
    estado: 'Activo',
    especificaciones: {
      procesador: '',
      ram: '',
      almacenamiento: '',
      tarjeta_grafica: ''
    }
  });

  // Efecto que nos ayuda a traer la lista de los profesores disponibles a cargo de los laboratorios
  useEffect(() => {
    const cargarProfesores = async () => {
        try {
            const response = await fetch(`${ApiRestLab}/profesores`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setProfesores(data);
        } catch (error) {
            console.error("Error cargando los nombres de los profesores:", error);
        }
    };

    if (isOpen) {
      cargarProfesores();
    }
  }, [isOpen]);

  // Efecto que nos ayuda a traer los laboratorios disponibles
  useEffect(() => {
    const cargarLabs = async () => {
        try {
            const response = await fetch(`${ApiRestLab}/numLabs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setLabs(data);
        } catch (error) {
            console.error("Error cargando los nombres de los laboratorios:", error);
        }
    };

    if (isOpen) {
      cargarLabs();
    }
  }, [isOpen]);

  // Efecto para cargar datos si vamos a EDITAR o limpiar si es NUEVO
  useEffect(() => {
  if (equipoEditar !== null && equipoEditar !== undefined) {
    setFormData({
      id_pc: equipoEditar?.id_pc || '',
      nombre_pc: equipoEditar?.nombre_pc || '',
      numero_laboratorio: equipoEditar?.numero_laboratorio || '',
      profesor_cargo: equipoEditar?.profesor_cargo || '',
      estado: equipoEditar?.estado || 'Activo',
      especificaciones: {
        procesador: equipoEditar?.especificaciones?.procesador || '',
        ram: equipoEditar?.especificaciones?.ram || '',
        almacenamiento: equipoEditar?.especificaciones?.almacenamiento || '',
        tarjeta_grafica: equipoEditar?.especificaciones?.tarjeta_grafica || ''
        }
    });
  } else {
    setFormData({
      id_pc: '',
      nombre_pc: '',
      numero_laboratorio: '',
      profesor_cargo: '',
      estado: 'Activo',
      especificaciones: {
        procesador: '',
        ram: '',
        almacenamiento: '',
        tarjeta_grafica: ''
        }
      });
    }
  }, [equipoEditar, isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación para SKU y Nombre (permitimos letras, números, puntos, comas, guiones y guiones bajos, pero no espacios ni otros símbolos)
    const regexPermitido = /^[a-zA-Z0-9\_]*$/;
    if (name === 'id_pc' || name === 'nombre_pc') {
      if (!regexPermitido.test(value)) {
        return; 
      }
    }
    
    // Manejo de campos anidados como especificaciones.procesador, especificaciones.ram, etc.
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const regexHardware = /^[a-zA-Z0-9 .\-_,/]*$/;

      if (parent === 'especificaciones' && !regexHardware.test(value)) {
        return; 
      }
      
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
      return; 
    } 
    
    // Campos normales de la raíz
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // POR ESTO (Incluye puntos, comas y guiones medios):
    const regexValidacion = /^[a-zA-Z0-9.\-_,]+$/;

    if (!regexValidacion.test(formData.id_pc) || !regexValidacion.test(formData.nombre_pc)) {
      Swal.fire({
        title: 'Formato inválido',
        text: 'El SKU (ID PC) y el Nombre solo pueden contener letras, números, puntos (.), comas (,), guiones (-) y guiones bajos (_). Sin espacios ni símbolos como & o %.',
        icon: 'warning',
        confirmButtonColor: '#4f46e5'
      });
      return; // Detiene el envío del formulario
    }


    const url = equipoEditar ? `${ApiRestLab}/${encodeURIComponent(formData.id_pc)}` : ApiRestLab;
    const method = equipoEditar ? 'PUT' : 'POST';

    try {
      const dataToSend = {
        id_pc: formData.id_pc,
        nombre_pc: formData.nombre_pc,
        numero_laboratorio: formData.numero_laboratorio,
        profesor_cargo: formData.profesor_cargo,
        estado: formData.estado,
        especificaciones: {
          procesador: formData.especificaciones.procesador,
          ram: formData.especificaciones.ram,
          almacenamiento: formData.especificaciones.almacenamiento,
          tarjeta_grafica: formData.especificaciones.tarjeta_grafica
        }
      };


      console.log("📤 ENVIANDO:", dataToSend);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: method === 'POST' ? '¡Ingreso Exitoso!' : '¡Edición Exitosa!',
          text: method === 'POST' ? 'El equipo ha sido ingresado correctamente.' : 'El equipo ha sido actualizado correctamente.',
          icon: 'success',
          confirmButtonColor: '#4f46e5',
          timer: 2000, 
          timerProgressBar: true
        });
        onSave();
        onClose();
        

      } else {
        // CORRECCIÓN: Usamos 'data' que es la respuesta JSON del servidor
        Swal.fire({
          title: 'Error en el servidor',
          text: data.msg || data.message || 'No se pudo procesar la solicitud o el id del equipo o nombre estan repetidos',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
        console.error("❌ ERROR BACKEND:", data);
      }

    } catch (error) {
      // Este catch captura errores de red (ej. sin internet, server apagado)
      Swal.fire({
          title: 'Error de Conexión',
          text: 'No se pudo establecer comunicación con el servidor.',
          icon: 'error',
          confirmButtonColor: '#d33'
      });
      console.error("❌ ERROR RED:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header del Modal */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Monitor className="text-indigo-600" />
            {equipoEditar ? `Editando SKU: ${formData.id_pc}` : 'Registrar Nuevo Equipo'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Fila 1: SKU y Nombre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU (ID PC)</label>
              <input
                name="id_pc"
                value={formData.id_pc}
                onChange={handleChange}
                disabled={!!equipoEditar} // Deshabilitado si estamos editando
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 font-mono"
                required
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Equipo</label>
              <input
                name="nombre_pc"
                value={formData.nombre_pc}
                onChange={handleChange}
                disabled={!!equipoEditar} // Deshabilitado si estamos editando
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Fila 2: Laboratorio, Profesor y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Laboratorio</label>
                <select
                name="numero_laboratorio"
                value={formData.numero_laboratorio}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all"
                required
              >
                <option value="" disabled>Seleccionar Laboratorio</option>
                {labs.map((lab) => (
                  <option key={lab._id} value={lab.nombre}>
                    {lab.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Profesor a cargo
              </label>
              <select
                name="profesor_cargo"
                value={formData.profesor_cargo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              >
                <option value="" disabled>Seleccionar profesor</option>
                {profesores.map((profe) => (
                  <option key={profe._id} value={profe.nombre}>
                    {profe.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado del equipo</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                formData.estado === 'Activo' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500' :
                formData.estado === 'En Reparación' ? 'border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-500' :
                formData.estado === 'Dañado' ? 'border-rose-200 bg-rose-50 text-rose-700 focus:ring-rose-500' :
                'border-slate-200 bg-slate-50 text-slate-700 focus:ring-slate-500' // Para Inactivo
                }`}
              >
              {!equipoEditar ? (
                <>
                  <option value="Activo">🟢 Activo</option>
                  <option value="Inactivo">⚪ Inactivo</option>
                </>
              ) : (
                <>
                  <option value="Activo">🟢 Activo</option>
                  <option value="En Reparación">🟡 En Reparación</option>
                  <option value="Dañado">🔴 Dañado</option>
                  <option value="Inactivo">⚪ Inactivo</option>
                </>
              )}
              </select>
            </div>
          </div>

          {/* Sección de Especificaciones (Anidados) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
              <Cpu size={16} /> Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="text-slate-400" size={18} />
                <input
                  name="especificaciones.procesador"
                  placeholder="Procesador"
                  value={formData.especificaciones.procesador}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Database className="text-slate-400" size={18} />
                <select
                  name="especificaciones.ram"
                  placeholder="Memoria RAM"
                  value={formData.especificaciones.ram}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:border-indigo-500"
                >
                  <option value="" disabled >Seleccionar RAM</option>
                  <option value="8 GB">8 GB</option>
                  <option value="16 GB">16 GB</option>
                  <option value="32 GB">32 GB</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="text-slate-400" size={18} />
                <select
                  name="especificaciones.almacenamiento"
                  placeholder="Disco Duro / SSD"
                  value={formData.especificaciones.almacenamiento}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Seleccionar Almacenamiento</option>
                  <option value="256 GB SSD">256 GB SSD</option>
                  <option value="512 GB SSD">512 GB SSD</option>
                  <option value="1 TB SSD">1 TB SSD</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-400">T/G:</span>
                <input
                  name="especificaciones.tarjeta_grafica"
                  placeholder="Tarjeta Grafica"
                  value={formData.especificaciones.tarjeta_grafica}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Save size={18} />
              {equipoEditar ? 'Actualizar Cambios' : 'Guardar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaboratorioModal;