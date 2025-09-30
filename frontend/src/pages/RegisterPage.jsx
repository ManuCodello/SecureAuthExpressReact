// frontend/src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react'; // 👈 Importa useEffect
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(''); // Estado para guardar el token CSRF
  const navigate = useNavigate();

  // useEffect se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    // Función para obtener el token CSRF del backend
    const fetchCsrfToken = async () => {
      try {
        const response = await authService.getCsrfToken();
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        setError('No se pudo obtener el token de seguridad. Inténtalo de nuevo más tarde.');
      }
    };

    fetchCsrfToken();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csrfToken) { // Si aún no tenemos el token, no continuamos
      setError('Error de seguridad. Por favor, refresca la página.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // 👇 Ahora pasamos el token CSRF a nuestro servicio
      await authService.register(formData.email, formData.password, csrfToken);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al registrarse.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-white">
          Crear una cuenta
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... inputs de email y password (sin cambios) ... */}
          <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
             <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              // Deshabilita el botón si estamos cargando O si aún no tenemos el token CSRF
              disabled={isLoading || !csrfToken}
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;