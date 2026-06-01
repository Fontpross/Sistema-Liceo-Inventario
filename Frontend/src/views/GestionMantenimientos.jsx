import React, { useState, useEffect } from 'react';
import { Beaker, Plus, Trash2, Edit3, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { ApiRestSubLab } from '../Config/api';
import Swal from 'sweetalert2';

const GestionLab = () => {
    const [laboratorios, setLaboratorios] = useState([]);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', estado: 'Activo' });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    useEffect(() => { obtenerLaboratorios(); }, []);

    const obtenerLaboratorios = async () => {
        try {
            const res = await fetch(ApiRestSubLab, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setLaboratorios(data);
        } catch (error) { mostrarMensaje("Error de conexión", "error"); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombreFormateado = formData.nombre.trim();

        // 2. VALIDACIÓN DE NOMBRE REPETIDO
        if (!editando) {
            const existe = laboratorios.some(
                (lab) => lab.nombre.toLowerCase() === nombreFormateado.toLowerCase()
            );

            if (existe) {
                Swal.fire({
                    title: '¡Nombre duplicado!',
                    text: `El laboratorio "${nombreFormateado}" ya se encuentra registrado.`,
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5',
                    confirmButtonText: 'Entendido'
                });
                return; 
            }
        }

        const baseUrl = ApiRestSubLab.endsWith('/') ? ApiRestSubLab.slice(0, -1) : ApiRestSubLab;
        const url = editando ? `${baseUrl}/${encodeURIComponent(editando.nombre)}` : baseUrl;
        const method = editando ? 'PUT' : 'POST';
        
        const cuerpoPeticion = editando 
        ? { nuevoNombre: nombreFormateado, estado: formData.estado } 
        : { nombre: nombreFormateado, estado: formData.estado };

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(cuerpoPeticion)
            });

            if (res.ok) {
                setFormData({ nombre: '', estado: 'Activo' });
                setEditando(null);
                obtenerLaboratorios();
                
                
                Swal.fire({
                    title: '¡Éxito!',
                    text: editando ? "Laboratorio actualizado correctamente" : "Laboratorio creado correctamente",
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                
                const errorData = await res.json();
                mostrarMensaje(errorData.mensaje || "Error en la operación", "error");
            }
        } catch (error) { mostrarMensaje("Error en la operación", "error"); }
    };

    const prepararEdicion = (lab) => {
        setEditando(lab);
        setFormData({ nombre: lab.nombre, estado: lab.estado });
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    // Eliminación usando SweetAlert2
    const handleEliminar = async (nombre) => {
        Swal.fire({
            title: `¿Eliminar ${nombre}?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', 
            cancelButtonColor: '#64748b',  
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${ApiRestSubLab}/${encodeURIComponent(nombre)}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (res.ok) {
                        obtenerLaboratorios();
                        Swal.fire('¡Eliminado!', 'El laboratorio ha sido borrado.', 'success');
                    }
                } catch (error) { 
                    Swal.fire('Error', 'No se pudo eliminar el laboratorio.', 'error');
                }
            }
        });
    };

    const mostrarMensaje = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    };

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
                        <Beaker className="text-indigo-600" /> Sedes de Laboratorio
                    </h1>
                    <p className="text-slate-500 text-sm">Configuración de espacios físicos</p>
                </div>
            </header>

            {/* ALERTAS LOCALES (Mantienen su funcionalidad para errores rápidos de conexión) */}
            {mensaje.texto && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    mensaje.tipo === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                    {mensaje.tipo === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                    <span className="text-sm font-bold">{mensaje.texto}</span>
                </div>
            )}

            {/* TABLA */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-4 py-4">Nombre del Laboratorio</th>
                                <th className="px-4 py-4 hidden sm:table-cell">Estado Operativo</th>
                                <th className="px-4 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {laboratorios.map((lab) => (
                                <tr key={lab._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4 font-bold text-slate-700">{lab.nombre}</td>
                                    <td className="px-4 py-4 hidden sm:table-cell">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lab.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {lab.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => prepararEdicion(lab)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit3 size={18}/></button>
                                        <button onClick={() => handleEliminar(lab.nombre)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FORMULARIO */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-md border-t-4 border-indigo-600">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    {editando ? <Edit3 size={20} className="text-amber-500"/> : <Plus size={20} className="text-indigo-600 " />}
                    {editando ? `Editando: ${editando.nombre}` : 'Añadir Nuevo Espacio'}
                </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-500 uppercase">Nombre</label>
                        <input name="nombre" value={formData.nombre} onChange={handleInputChange} disabled={!!editando} placeholder="Ej: Laboratorio 1" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-500 uppercase">Estado</label>
                        <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                            <option value="Activo">🟢 Activo</option>
                            <option value="Inactivo">⚪ Inactivo</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                            <Save size={20}/> {editando ? 'Actualizar Información' : 'Registrar Laboratorio'}
                        </button>
                        {editando && (
                            <button type="button" onClick={() => {setEditando(null); setFormData({nombre:'', estado:'Activo'})}} className="sm:w-32 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold transition-all">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GestionLab;