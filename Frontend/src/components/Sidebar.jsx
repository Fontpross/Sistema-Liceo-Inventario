import React from 'react'
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beaker, Book, Trophy } from 'lucide-react';

const Sidebar = () => {
    const links = [
        { name: 'Inicio', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'ADM Computadores', path: '/laboratorio', icon: <Beaker size={20} /> },
        { name: 'ADM Reportes', path: '/reportes', icon: <Trophy size={20} /> },
        
    ];

    const subLinks = [
        { name: 'Gestion Laboratorios', path: '/gestionLaboratorio', icon: <Beaker size={20} /> },
        { name: 'Gestion Mantenimientos', path: '/gestionMantenimientos', icon: <Beaker size={20} /> },
    ]

    return (
        /* Cambiamos w-64 por w-20 (móvil) y sm:w-64 (escritorio) */
        <div className="w-20 sm:w-64 bg-black min-h-screen text-white flex flex-col shadow-xl transition-all duration-300">
            
            {/* Logo: Texto completo en PC, siglas o icono en móvil */}
            <div className="p-6 text-center border-b border-slate-800">
                <span className="hidden sm:block text-sm font-black text-yellow-400 tracking-tighter">
                    SISTEMA DE INVENTARIO
                </span>
                <span className="block sm:hidden text-xl font-black text-yellow-400">
                    S.I
                </span>
            </div>
            
            <nav className="flex-1 mt-4 px-3 sm:px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center justify-center sm:justify-start gap-4 p-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {/* El icono siempre se ve, pero ajustamos el tamaño si es necesario */}
                        <span className="flex-shrink-0">{link.icon}</span>
                        
                        {/* El nombre se oculta en móvil y aparece en sm (640px en adelante) */}
                        <span className="hidden sm:block font-medium truncate">
                            {link.name}
                        </span>
                    </NavLink>
                ))}
                <br />
                {subLinks.map((subLinks) => (
                    <NavLink
                        key={subLinks.path}
                        to={subLinks.path}
                        className={({ isActive }) =>
                            `flex items-center justify-center sm:justify-start gap-4 p-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {/* El icono siempre se ve, pero ajustamos el tamaño si es necesario */}
                        <span className="flex-shrink-0">{subLinks.icon}</span>
                        
                        {/* El nombre se oculta en móvil y aparece en sm (640px en adelante) */}
                        <span className="hidden sm:block font-medium truncate">
                            {subLinks.name}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Versión del sistema: oculta en móvil */}
            <div className="p-4 border-t border-slate-800 text-[10px] text-center text-slate-500">
                <span className="hidden sm:inline">v1.0 - Liceo Control</span>
                <span className="inline sm:hidden">v1.0</span>
            </div>
        </div>
    );
};

export default Sidebar;