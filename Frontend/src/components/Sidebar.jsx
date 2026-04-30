import React from 'react'
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beaker, Book, Trophy, LogOut } from 'lucide-react';

const Sidebar = () => {
    const links = [
    { name: 'Inicio', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Laboratorio', path: '/laboratorio', icon: <Beaker size={20} /> },
    { name: 'Deportes', path: '/deportes', icon: <Trophy size={20} /> },
    { name: 'Biblioteca', path: '/biblioteca', icon: <Book size={20} /> },
    ];

return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col shadow-xl">
      <div className="p-6 text-center border-b border-slate-800">
        <span className="text-1xl font-black text-indigo-400">SISTEMA DE INVENTARIO</span>
      </div>
      
      <nav className="flex-1 mt-4 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
        v1.0 - Liceo Control
      </div>
    </div>
  );
};

export default Sidebar;