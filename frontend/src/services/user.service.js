// frontend/src/services/user.service.js

import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

// Creamos una instancia de axios para este servicio
const api = axios.create({
  baseURL: API_URL,
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

const userService = {
  getAllUsers,
  // Aquí añadiríamos createUser, updateUser, etc. en el futuro
};

export default userService;