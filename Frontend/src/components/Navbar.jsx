import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { User, LogOut, ShieldCheck, UserCircle, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [usuario, setUsuario] = useState({ nombre: '', rol: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Extraemos los datos del token decodificado
        setUsuario({
          nombre: decoded.nombre || decoded.username || 'Usuario',
          rol: decoded.rol || decoded.role || 'Invitado'
        });
      } catch (error) {
        console.error("Error al leer el token:", error);
        handleLogout(); // Si el token es corrupto, mejor cerrar sesión
      }
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    // 1. Limpiamos TODO el localStorage o solo el token
    localStorage.removeItem('token');
    localStorage.removeItem('user_name'); // Por si guardaste algo más
    
    // 2. Opcional: Limpiar estados
    setUsuario({ nombre: '', rol: '' });
    
    // 3. Redirigir al Login
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm relative z-50">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
          SISTEMA <span className="text-slate-800">LICEO</span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Etiqueta de Rol */}
        <div className={`hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          usuario.rol.toLowerCase() === 'admin' 
          ? 'bg-rose-50 text-rose-600 border-rose-200' 
          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          {usuario.rol.toLowerCase() === 'admin' ? <ShieldCheck size={12} /> : <UserCircle size={12} />}
          <span>{usuario.rol}</span>
        </div>

        {/* Menú del Perfil */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none p-1.5 hover:bg-slate-50 rounded-xl transition-all"
          >
            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-slate-700 leading-none">{usuario.nombre}</p>
              <p className="text-[10px] text-slate-400 mt-1">Mi Perfil</p>
            </div>
            
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Desplegable (Dropdown) */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-150">
              <div className="px-4 py-2 border-b border-slate-100 mb-1 md:hidden">
                <p className="text-xs font-bold text-slate-500 uppercase">{usuario.rol}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;