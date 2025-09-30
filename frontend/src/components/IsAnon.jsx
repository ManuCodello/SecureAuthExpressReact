// frontend/src/components/IsAnon.jsx
import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsAnon({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  // Si el usuario está logueado, lo redirigimos a su dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  // Si no está logueado, le permitimos ver la página (login o registro)
  return children;
}

export default IsAnon;