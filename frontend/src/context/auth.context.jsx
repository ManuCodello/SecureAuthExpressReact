// frontend/src/context/auth.context.jsx

import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios'; // Usaremos axios para verificar el token

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

    if (storedToken) {
      try {
        // Hacemos una petición al backend para verificar si el token aún es válido
        const response = await axios.get('http://localhost:5001/api/profile/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        // Si el token es válido, el backend nos devuelve los datos del usuario
        const userData = response.data.user;
        
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(userData);

      } catch (error) {
        // Si el token es inválido o expiró
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      // Si no hay token en localStorage
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  // 5. Función para cerrar sesión
  const logoutUser = () => {
    localStorage.removeItem('authToken'); // Elimina el token
    authenticateUser(); // Re-evalúa el estado (que ahora será "no logueado")
  };
  
  // 6. useEffect para que la verificación se ejecute una sola vez cuando la app se carga
  useEffect(() => {
    authenticateUser();
  }, []);

  // 7. El valor que emitirá nuestra "señal Wi-Fi": los estados y las funciones.
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