// frontend/src/components/IsPrivate.jsx
import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsPrivate({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // Si la autenticación aún se está cargando, mostramos un mensaje de carga
  if (isLoading) {
    return <p>Cargando...</p>;
  }

  // Si el usuario no está logueado, lo redirigimos a la página de login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está logueado, mostramos la página que este componente envuelve
  return children;
}

export default IsPrivate;