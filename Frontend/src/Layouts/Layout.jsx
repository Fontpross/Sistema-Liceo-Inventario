import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Layout = () => {
  // Capa 2 Validation de token y Proteccion de rutas.
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen"> 
      {/* El Sidebar se queda fijo a la izquierda */}
      <Sidebar /> 

      <div className="flex-1 flex flex-col">
        {/* El Navbar se queda fijo arriba */}
        <Navbar /> 

        {/* El contenido de cada página cambia aquí abajo */}
        <main className="p-6 bg-gray-100 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Layout;