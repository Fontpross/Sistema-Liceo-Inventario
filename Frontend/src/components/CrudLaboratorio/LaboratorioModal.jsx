import React, { useState, useEffect } from 'react';
import { X, Save, Cpu, Database, HardDrive, Monitor } from 'lucide-react';
import { ApiRestLab } from '../../Config/api'; // Importamos tu URL base

const LaboratorioModal = ({ isOpen, onClose, onSave, equipoEditar }) => {
  // Estado inicial del formulario siguiendo tu esquema de MongoDB
  const [formData, setFormData] = useState({
    id_pc: '',
    nombre_pc: '',
    numero_laboratorio: 'Laboratorio 1',
    profesor_cargo: '',
    estado: 'Activo',
    especificaciones: {
      procesador: '',
      ram: '',
      almacenamiento: '',
      tarjetaGrafica: ''
    }
  });

  // Efecto para cargar datos si vamos a EDITAR o limpiar si es NUEVO
  useEffect(() => {
  if (equipoEditar !== null && equipoEditar !== undefined) {
    setFormData({
      id_pc: equipoEditar?.id_pc || '',
      nombre_pc: equipoEditar?.nombre_pc || '',
      numero_laboratorio: equipoEditar?.numero_laboratorio || 'Laboratorio 1',
      profesor_cargo: equipoEditar?.profesor_cargo || '',
      estado: equipoEditar?.estado || 'Activo',
      especificaciones: {
        procesador: equipoEditar?.especificaciones?.procesador || '',
        ram: equipoEditar?.especificaciones?.ram || '',
        almacenamiento: equipoEditar?.especificaciones?.almacenamiento || '',
        tarjetaGrafica: equipoEditar?.especificaciones?.tarjetaGrafica || ''
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
        tarjetaGrafica: ''
        }
      });
    }
  }, [equipoEditar, isOpen]);

  // Manejador de cambios para campos normales y anidados (especificaciones)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

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
        tarjetaGrafica: formData.especificaciones.tarjetaGrafica
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
      onSave();
      onClose();
    } else {
      console.error("❌ ERROR BACKEND:", data);
      alert(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error("Error en la petición:", error);
    alert("Error de conexión con el servidor puerto 5000");
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                formData.numero_laboratorio === 'Laboratorio 1' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500' :
                formData.numero_laboratorio === 'Laboratorio 2' ? 'border-emerald-200 bg-emerald-50 text-emerald-300 focus:ring-emerald-500' :
                formData.numero_laboratorio === 'Laboratorio 3' ? 'border-emerald-200 bg-emerald-50 text-emerald-300 focus:ring-emerald-500' :
                ''}`}
              >
                <option value="">Seleccione laboratorio</option>
                <option value="Laboratorio 1">Laboratorio 1</option>
                <option value="Laboratorio 2">Laboratorio 2</option>
                <option value="Laboratorio 3">Laboratorio 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profesor</label>
              <input
                name="profesor_cargo"
                value={formData.profesor_cargo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
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
                <option value="Activo">🟢 Activo</option>
                <option value="En Reparación">🟡 En Reparación</option>
                <option value="Dañado">🔴 Dañado</option>
                <option value="Inactivo">⚪ Inactivo</option>
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
                <input
                  name="especificaciones.ram"
                  placeholder="Memoria RAM"
                  value={formData.especificaciones.ram}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="text-slate-400" size={18} />
                <input
                  name="especificaciones.almacenamiento"
                  placeholder="Disco Duro / SSD"
                  value={formData.especificaciones.almacenamiento}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-400">T/G:</span>
                <input
                  name="especificaciones.tarjetaGrafica"
                  placeholder="Tarjeta Grafica"
                  value={formData.especificaciones.tarjetaGrafica}
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