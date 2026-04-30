import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerResumen = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/dashboard/resumen', {
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

            <section className="flex flex-wrap ,justify-start">
                {/* Usuarios */}
                <div className="stat-card gray border w-40 h-40">
                    <div className="stat-icon">👤</div>
                    <div className="stat-info">
                        <span className="stat-label">Usuarios</span>
                        <span className="stat-value">{data.usuarios}</span>
                    </div>
                </div>

                {/* Laboratorio */}
                <div className="stat-card border blue w-40 h-40">
                    <div className="stat-icon">💻</div>
                    <div className="stat-info">
                        <span className="stat-label">Laboratorio</span>
                        <span className="stat-value">{data.itemsLaboratorio}</span>
                    </div>
                </div>

                {/* Libros */}
                <div className="stat-card green w-40 h-40 border">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <span className="stat-label">Libros</span>
                        <span className="stat-value">{data.totalLibros}</span>
                    </div>
                </div>

                {/* Deportes */}
                <div className="stat-card orange w-40 h-40 border">
                    <div className="stat-icon">⚽</div>
                    <div className="stat-info">
                        <span className="stat-label">Deportes</span>
                        <span className="stat-value">{data.itemsDeportes}</span>
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