import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Monitor, 
  Search, 
  MoreVertical,
  Cpu,
  RefreshCw
} from 'lucide-react';
//import LaboratorioModal from '../components/LaboratorioModal'; // El que creamos antes
import { ApiRest } from '../Config/api';

const Laboratorio = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("");

  // 1. Cargar datos desde el Backend
  const cargarEquipos = async () => {
    setLoading(true);
    try {
      const response = await fetch(ApiRest, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setEquipos(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  // 2. Función para eliminar (usando el id_pc / SKU)
  const eliminarEquipo = async (id_pc) => {
    if (window.confirm(`¿Estás seguro de eliminar el equipo con SKU: ${id_pc}?`)) {
      try {
        await fetch(`http://localhost:5000/api/laboratorio/${id_pc}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        cargarEquipos(); // Recargar tabla
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  // 3. Filtrar equipos por SKU o Nombre
  const equiposFiltrados = equipos.filter(eq => 
    eq.id_pc.toLowerCase().includes(filtro.toLowerCase()) ||
    eq.nombre_pc.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Monitor className="text-indigo-600" size={28} />
            INVENTARIO DE LABORATORIO
          </h1>
          <p className="text-slate-500 text-sm">Gestión de equipos por SKU y especificaciones técnicas</p>
        </div>

        <button 
          onClick={() => { setEquipoSeleccionado(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Nuevo Equipo
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por SKU (ID PC) o nombre..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <button 
          onClick={cargarEquipos}
          className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          title="Refrescar datos"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">SKU / ID PC</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Equipo</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Ubicación</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Especificaciones</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equiposFiltrados.length > 0 ? (
                equiposFiltrados.map((equipo) => (
                  <tr key={equipo._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 font-mono text-sm font-bold text-indigo-600">
                      {equipo.id_pc}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{equipo.nombre_pc}</div>
                      <div className="text-xs text-slate-400">{equipo.profesor_cargo}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {equipo.Numero_laboratorio}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          <Cpu size={10} /> {equipo.especificaciones?.procesador || 'N/A'}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {equipo.especificaciones?.ram || 'N/A'} RAM
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        equipo.estado === 'Activo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        equipo.estado === 'En Reparación' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {equipo.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => { setEquipoSeleccionado(equipo); setIsModalOpen(true); }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => eliminarEquipo(equipo.id_pc)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    {loading ? "Cargando datos..." : "No se encontraron equipos en el inventario."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de CRUD */}
      <LaboratorioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        equipoEditar={equipoSeleccionado}
        onSave={cargarEquipos} // Recarga la tabla después de guardar/actualizar
      />
    </div>
  );
};

export default Laboratorio;