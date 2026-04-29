import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importamos tus vistas (asegúrate de que los nombres de archivo coincidan)
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Laboratorio from './views/Laboratorio'
import Biblioteca from './views/Biblioteca'
import Deportes from './views/Deportes'


// Importamos los estilos globales
import './Css/Login.css';

function App() {
  // Función para verificar si el usuario está autenticado
  // Esto revisa si existe el 'token' que guardamos al hacer login
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <Routes>
        {/* 1. Ruta de Inicio de Sesión: Es la primera que carga */}
        <Route path="/" element={<Login />} />

        {/* 2. Ruta Protegida: Solo entra si está autenticado, si no, al Login */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} 
        />

        {/* 3 de gestion de laboratorio.
            Ruta Protegida: Solo entra si está autenticado, si no, al Login */}
        <Route 
          path="/laboratorio" 
          element={isAuthenticated() ? <Laboratorio /> : <Navigate to="/" />} 
        />
        
        {/* 4 de gestion de biblioteca.
            Ruta Protegida: Solo entra si está autenticado, si no, al Login */}
        <Route 
          path="/biblioteca" 
          element={isAuthenticated() ? <Biblioteca /> : <Navigate to="/" />} 
        />
        
        {/* 5 de gestion de deportes.
             Ruta Protegida: Solo entra si está autenticado, si no, al Login */}
        <Route 
          path="/deportes" 
          element={isAuthenticated() ? <Deportes /> : <Navigate to="/" />} 
        />

        {/* 6. Comodín: Si escriben cualquier otra cosa en la URL, los manda al Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;