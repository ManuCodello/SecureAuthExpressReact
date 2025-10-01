// frontend/src/context/auth.context.jsx

import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios'; // Usaremos axios para verificar el token
import authService from '../services/auth.service';

// 1. Creamos el Contexto. Es el objeto que los componentes usarán para conectarse.
const AuthContext = createContext();

// 2. Creamos el componente Proveedor (nuestro "router Wi-Fi").
function AuthProvider({ children }) {
  // 3. Definimos los estados que queremos compartir globalmente.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Para saber si estamos verificando el token
  const [user, setUser] = useState(null);

  // 4. Función para guardar el token y actualizar el estado.
  const storeToken = (token) => {
    localStorage.setItem('authToken', token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem('authToken');

    try {
      if (storedToken) {
        // Intento 1: JWT
        const response = await axios.get('http://localhost:5001/api/profile/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
          withCredentials: true,
        });
        const userData = response.data.user;
        setIsLoggedIn(true);
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // Intento 2: Sesión por cookie
      const response = await axios.get('http://localhost:5001/api/profile/me', {
        withCredentials: true,
      });
      const userData = response.data.user;
      setIsLoggedIn(true);
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  // 5. Función para cerrar sesión
  const logoutUser = async () => {
    try {
      const csrf = await authService.getCsrfToken();
      await authService.logout(csrf.data.csrfToken);
    } catch (e) {
      // ignoramos error de logout
    }
    localStorage.removeItem('authToken');
    await authenticateUser();
  };
  
  // 6. useEffect para que la verificación se ejecute una sola vez cuando la app se carga
  useEffect(() => {
    authenticateUser();
  }, []);

  // 7. El valor que emitirá nuestra "señal Wi-Fi": los estados y las funcion.
  const value = {
    isLoggedIn,
    isLoading,
    user,
    storeToken,
    authenticateUser,
    logoutUser,
  };

  console.log("Estado del AuthContext:", value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 8. Exportamos el Proveedor y el Contexto.
export { AuthProvider, AuthContext };