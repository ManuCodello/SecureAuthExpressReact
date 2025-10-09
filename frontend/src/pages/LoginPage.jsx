// frontend/src/pages/LoginPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { AuthContext } from '../context/auth.context';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  
  // Obtenemos las funciones para actualizar el estado directamente
  const { setUser, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await authService.getCsrfToken();
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        setError('No se pudo obtener el token de seguridad. Inténtalo de nuevo más tarde.');
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('Error de seguridad. Por favor, refresca la página.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // 1. Llamamos al login y guardamos la respuesta
      const response = await authService.login(formData.email, formData.password, csrfToken);
      
      // 2. Extraemos los datos del usuario de la respuesta del login
      const userData = response.data.user;
      
      // 3. Actualizamos el estado global del contexto DIRECTAMENTE
      setUser(userData);
      setIsLoggedIn(true);
      
      // 4. Navegamos al dashboard
      navigate('/dashboard'); 
      
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-white">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Correo Electrónico</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tu@email.com" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Contraseña</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading || !csrfToken}
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;