// Modal para poder crear un nuevo reporte de mantenimiento para un equipo del laboratorio,
// Este modal se muestra al hacer click en el boton "Crear Reporte" en la vista del laboratorio.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ApiRestRep } from '../../Config/api'; // Importamos tu URL base
import Swal from 'sweetalert2';
import { X, FileText } from 'lucide-react';


const ReporteModal = ({ isOpen, onClose, equipo, onSave }) => {
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!isOpen || !equipo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // Aquí haces la petición POST a tu backend
      /*
      const res = await fetch(ApiRestReportes, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id_pc: equipo.id_pc,
          nombre_pc: equipo.nombre_pc,
          laboratorio: equipo.numero_laboratorio,
          descripcion: descripcion,
          fecha: new Date()
        })
      });
      if (res.ok) { onSave(); onClose(); setDescripcion(""); }
      */
      
      // Simulación de éxito:
      console.log("Reporte enviado para:", equipo.id_pc, "Descripción:", descripcion);
      alert(`Reporte enviado con éxito para el equipo ${equipo.id_pc}`);
      onClose();
      setDescripcion("");
    } catch (error) {
      console.error("Error al enviar reporte:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabecera */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <FileText className="text-rose-500" size={20} />
            CREAR REPORTE DE FALLA
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo / Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm space-y-1">
            <p className="text-slate-600"><strong>SKU / ID PC:</strong> <span className="font-mono font-bold text-indigo-600">{equipo.id_pc}</span></p>
            <p className="text-slate-600"><strong>Nombre Equipo:</strong> {equipo.nombre_pc}</p>
            <p className="text-slate-600"><strong>Ubicación:</strong> {equipo.numero_laboratorio}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase">Detalle del problema</label>
            <textarea
              required
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: La pantalla parpadea y se apaga a los 5 minutos de uso..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2"
          >
            {enviando ? "Enviando..." : "Enviar Reporte Técnico"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ReporteModal;