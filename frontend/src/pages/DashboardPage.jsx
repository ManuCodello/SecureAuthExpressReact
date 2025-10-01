// frontend/src/pages/DashboardPage.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Nos conectamos al contexto para obtener los datos del usuario y la función de logout
  const { user, logoutUser } = useContext(AuthContext);

  // Si por alguna razón el usuario no se ha cargado, mostramos un mensaje
  if (!user) {
    return <p>Cargando Perfil...</p>;
  }
  console.log("Rol del usuario para la comparación:", `>${user.role}<`);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-slate-800 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold">¡Bienvenido a tu Dashboard!</h1>
        <p className="text-xl text-slate-300">
          Hola, <span className="font-semibold text-indigo-400">{user.email}</span>.
        </p>
        <p className="text-md text-slate-400">
          Tu rol es: <span className="font-medium">{user.role}</span>
        </p>
        {user.role === 'Administrador' && (
          <div className="mt-4">
            <Link
              to="/admin"
              className="px-6 py-2 font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
            >
              Ir al Panel de Admin
            </Link>
          </div>
        )}
        <button
          onClick={logoutUser} // Al hacer clic, llamamos a la función de logout del contexto
          className="px-6 py-2 mt-4 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;