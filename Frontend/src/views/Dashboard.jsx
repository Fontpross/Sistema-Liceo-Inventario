import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ApiRestDash } from '../Config/api';
import user_img from '../imgs/user_img.jpg';
import PC_dash from '../imgs/PC_dash.jpg';
import Libros_dash from '../imgs/Libros_dash.png';
import Deporte_dash from '../imgs/Deporte_dash.png';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerResumen = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get( ApiRestDash, {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al traer el resumen", error);
                setLoading(false);
            }
        };
        obtenerResumen();
    }, []);

    if (loading) return <div className="p-10 text-center">Cargando estadísticas...</div>;
    if (!data) return <div className="p-10 text-center">No se pudieron cargar los datos.</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="text-2xl font-bold text-gray-800">Panel General</h1>
                <p className="text-gray-500">Resumen de inventario global</p>
            </header>
            <br />
            <section className="flex flex-wrap gap-4 text-center">

                {/* Usuarios */}
                <div className="stat-card w-full sm:w-48 h-auto py-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm bg-white">
                {/* Contenedor de imagen: más pequeña en móvil, tamaño normal en tablet/pc */}
                <div className="stat-icon w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4">
                    <img src={user_img} alt="imagen de usuario" className="w-full h-full object-contain" />
                </div>

                {/* Información con separación ajustable */}
                <div className="stat-info flex flex-col gap-0.5 sm:gap-1">
                    <span className="stat-label text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">
                        Usuarios
                    </span>
                    <span className="stat-value text-xl sm:text-2xl font-bold text-slate-800">
                        {data.usuarios}
                    </span>
                    </div>
                </div>

                {/* Laboratorio */}
                <div className="stat-card w-full sm:w-48 h-auto py-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm bg-white">
                    <div className="stat-icon w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4">
                        <img src={PC_dash} alt="imagen de pc" className="w-full h-full object-contain" />
                    </div>
                    <div className="stat-info flex flex-col gap-0.5 sm:gap-1">
                        <span className="stat-label text-gray-500 text-xs sm:text-sm font-medium uppercase">Laboratorio</span>
                        <span className="stat-value text-xl sm:text-2xl font-bold text-slate-800">{data.itemsLaboratorio}</span>
                    </div>
                </div>

                {/* Libros */}
                <div className="stat-card w-full sm:w-48 h-auto py-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm bg-white">
                    <div className="stat-icon w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4">
                        <img src={Libros_dash} alt="imagen de libros" className="w-full h-full object-contain" />
                    </div>
                    <div className="stat-info flex flex-col gap-0.5 sm:gap-1">
                        <span className="stat-label text-gray-500 text-xs sm:text-sm font-medium uppercase">Libros</span>
                        <span className="stat-value text-xl sm:text-2xl font-bold text-slate-800">{data.totalLibros}</span>
                    </div>
                </div>

                {/* Deportes */}
                <div className="stat-card w-full sm:w-48 h-auto py-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm bg-white">
                    <div className="stat-icon w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4">
                        <img src={Deporte_dash} alt="imagen de deportes" className="w-full h-full object-contain" />
                    </div>
                    <div className="stat-info flex flex-col gap-0.5 sm:gap-1">
                        <span className="stat-label text-gray-500 text-xs sm:text-sm font-medium uppercase">Deportes</span>
                        <span className="stat-value text-xl sm:text-2xl font-bold text-slate-800">{data.itemsDeportes}</span>
                    </div>
                </div>
                </section>
            {/* Banner de Total Global */}
            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center mt-6">
                <div>
                    <h2 className="text-xl font-bold">Total de Artículos Registrados</h2>
                    <p className="opacity-80">Suma de todas las categorías</p>
                </div>
                <span className="text-4xl font-black">{data.totalGlobal}</span>
            </div>
        </div>
    );
};

export default Dashboard;