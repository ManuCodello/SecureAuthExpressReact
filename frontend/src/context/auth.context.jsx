// frontend/src/context/auth.context.jsx

import React, { useState, createContext, useEffect } from 'react';
import authService from '../services/auth.service';

// Contexto de autenticación usado por la app.
// Este contexto mantiene el estado del usuario, si está autenticado y si la comprobación está en curso.
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // authenticateUser: comprobación inicial/explicit para saber si el cliente está autenticado.
  const authenticateUser = async () => {
    setIsLoading(true);
    try {
      // Verificar si hay una sesión válida usando el endpoint /auth/verify
      const response = await authService.verify();
      
      // Verificar la respuesta
      if (response.data.isAuthenticated && response.data.user) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // logoutUser: solicita al backend cerrar sesión / invalidar cookie o JWT.
  // Se recomienda obtener el CSRF token antes de llamar a logout si el backend lo requiere.
  const logoutUser = async () => {
    try {
      const { data: csrfData } = await authService.getCsrfToken();
      await authService.logout(csrfData.csrfToken);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Siempre refrescamos el estado de autenticación tras intentar logout
      authenticateUser();
    }
  };

  useEffect(() => {
    // Comprobación inicial al montar el provider
    authenticateUser();
  }, []);

  const value = {
    isLoggedIn,
    isLoading,
    user,
    // Proveemos funciones para que otros componentes puedan forzar la comprobación o actualizar estado
    setIsLoggedIn,
    setUser,
    authenticateUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };