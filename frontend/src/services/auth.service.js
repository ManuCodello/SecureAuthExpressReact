// frontend/src/services/auth.service.js

import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Creamos una instancia de axios.
// ¡MUY IMPORTANTE! Añadimos 'withCredentials: true'.
// Esto le permite a axios enviar cookies ( como la de sesión CSRF) al backend.
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 Permite el envío de cookies
});

// Nueva función para obtener el token CSRF
const getCsrfToken = () => {
  return api.get('/csrf-token');
};

// Modificamos la función de registro para que acepte y envíe el token CSRF
const register = (email, password, csrfToken) => {
  return api.post('/auth/register', 
    { // Body de la petición
      email,
      password,
    }, 
    { // Opciones de la petición (aquí van las cabeceras)
      headers: {
        'x-csrf-token': csrfToken, // 👈 Enviamos el token en la cabecera correcta
      }
    }
  );
};

// Función para iniciar sesión con JWT
const login = (email, password, csrfToken) => {
  // Llama al endpoint de login con JWT
  return api.post('/auth/login', 
    { email, password },
    { headers: { 'x-csrf-token': csrfToken } }
  );
};

// Función para iniciar sesión con cookies (sesiones)
const loginWithSession = (email, password, csrfToken) => {
  return api.post('/auth/login-session',
    { email, password },
    { headers: { 'x-csrf-token': csrfToken } }
  );
};

// Cerrar sesión (invalida la sesión y limpia la cookie en el backend)
// Si hay JWT en localStorage lo envía en Authorization para que el backend lo ponga en blacklist
const logout = (csrfToken) => {
  const storedToken = localStorage.getItem('authToken');
  const headers = { 'x-csrf-token': csrfToken };
  if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;
  return api.post('/auth/logout', {}, { headers });
};

const authService = {
  getCsrfToken, // 👈 Exportamos la nueva función
  register,
  login,
  loginWithSession,
  logout,
};

export default authService;