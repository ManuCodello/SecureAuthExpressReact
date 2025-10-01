// frontend/src/services/user.service.js

import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

// Creamos una instancia de axios para este servicio
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Añadimos un "interceptor" a nuestra instancia.
// Esto es como un guardia que detiene cada petición antes de que salga.
api.interceptors.request.use((config) => {
  // Busca el token en localStorage
  const storedToken = localStorage.getItem('authToken');

  // Si el token existe, lo añade a la cabecera 'Authorization'
  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }

  return config;
});

// Función para obtener todos los usuarios
const getAllUsers = () => {
  // Hace una petición GET a la raíz de nuestra API de usuarios ('/api/users')
  return api.get('/');
};

// Eliminar mi propia cuenta (requiere autenticación)
const deleteSelf = (csrfToken) => api.delete('/me', { headers: { 'x-csrf-token': csrfToken } });

// Admin: eliminar por id
const deleteById = (id, csrfToken) => api.delete(`/${id}`, { headers: { 'x-csrf-token': csrfToken } });

// Admin: actualizar rol
const updateRole = (id, role, csrfToken) => api.patch(`/${id}/role`, { role }, { headers: { 'x-csrf-token': csrfToken } });

const userService = {
  getAllUsers,
  deleteSelf,
  deleteById,
  updateRole,
};

export default userService;