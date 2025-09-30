// frontend/src/components/IsAdmin.jsx
import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsAdmin({ children }) {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  // Muestra un mensaje de carga mientras se verifica la autenticación
  if (isLoading) {
    return <p>Cargando...</p>;
  }

  // Si no está logueado, redirige a la página de login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Si está logueado PERO su rol NO es 'Administrador',
  // lo redirigimos a su dashboard personal.
  if (user.role !== 'Administrador') {
    return <Navigate to="/dashboard" />;
  }

  // Si pasa todas las verificaciones, muestra la página de admin
  return children;
}

export default IsAdmin;