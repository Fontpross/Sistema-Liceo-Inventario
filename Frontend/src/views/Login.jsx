import React, { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {

  // Variables las cuales utilizaremos dentro de lo que es el Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Consulta al servidor por medio del endpoint las credenciales
            const respuesta = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  
            localStorage.setItem('token', respuesta.data.token);
            localStorage.setItem('name', respuesta.data.usuario.nombre);

            // Alerta de inicio de sesion
            await Swal.fire({
                title: '¡Inicio de Sesión Exitoso!',
                text: `Hola ${respuesta.data.usuario.nombre}, el sistema está listo.`,
                icon: 'success',
                confirmButtonColor: '#4f46e5', // El color morado de tu diseño
                timer: 2000, // Se cierra sola en 2 segundos
                timerProgressBar: true
            });
            
            navigate('/dashboard');

        }   catch (error) {
                setLoading(false)
                // Si express-validator manda errores, vienen en la propiedad 'errores'
                const listaErrores = error.response?.data?.errores;
                const mensaje = listaErrores ? listaErrores[0].msg : (error.response?.data?.msg || 'Error');
            
            // Alerta de error por credenciales incorrectas 
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.msg || 'Credenciales incorrectas',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        }
    };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <Lock className="logo-icon" />
          </div>
          <h1>Bienvenido </h1>
          <p>Gestión de Inventario - Liceo</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="ejemplo@liceo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <Loader2 className="spinner" /> : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;