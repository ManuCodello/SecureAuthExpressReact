// frontend/src/services/auth.service.js

import axios from 'axios';

// Base API para auth: usamos el prefijo /api del backend
const API_URL = 'http://localhost:5001/api';

// Instancia de axios para auth; withCredentials es CRUCIAL para enviar cookies HttpOnly
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Obtener token CSRF (GET) -> { csrfToken }
const getCsrfToken = () => api.get('/csrf-token');

// Registro de usuario (envía CSRF token en cabecera)
const register = (email, password, csrfToken) => {
  return api.post(
    '/auth/register',
    { email, password },
    { headers: { 'x-csrf-token': csrfToken } }
  );
};

// Login que coloca JWT en cookie HttpOnly (backend lo hace)
const login = (email, password, csrfToken) => {
  return api.post(
    '/auth/login',
    { email, password },
    { headers: { 'x-csrf-token': csrfToken } }
  );
};

// Login con sesión (si usas sesiones en lugar de JWT)
const loginWithSession = (email, password, csrfToken) => {
  return api.post(
    '/auth/login-session',
    { email, password },
    { headers: { 'x-csrf-token': csrfToken } }
  );
};

// Logout: intenta obtener CSRF y llamar al endpoint de logout
const logout = (csrfToken) => {
  return api.post('/auth/logout', {}, { headers: { 'x-csrf-token': csrfToken } });
};

// Estado de autenticación (ENDPOINT SILENCIOSO que devuelve 200 siempre)
// El backend responde { user: null } si no hay sesión/JWT válido.
// Verificar token JWT y obtener datos del usuario
const verify = () => api.get('/auth/verify');

const authService = {
  getCsrfToken,
  register,
  login,
  loginWithSession,
  logout,
  verify,
};

export default authService;