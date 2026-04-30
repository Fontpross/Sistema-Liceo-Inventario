import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layouts/Layout';

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

      {/* Rutas protegidas estan conectadas en el sidebar */}
      {/* Estas rutas las que se conectan al layout que son directamente lo que ve el usuario en el inventario*/}
        <Route 
          element={
            isAuthenticated() ? <Layout /> : <Navigate to="/" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/laboratorio" element={<Laboratorio />} />
          <Route path="/deportes" element={<Deportes />} />
          <Route path="/bibliteca" index element={<Biblioteca />} />
        </Route>

        {/* 6. Comodín: Si escriben cualquier otra cosa en la URL, los manda al Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;