// frontend/src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import userService from '../services/user.service';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'No tienes permiso para ver esta página.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); // El array vacío asegura que se ejecute solo una vez

  if (isLoading) {
    return <p className="text-center text-white mt-8">Cargando usuarios...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Panel de Administración</h1>
        <h2 className="text-2xl font-semibold mb-4 text-slate-300">Lista de Usuarios</h2>
        
        <div className="overflow-x-auto bg-slate-800 rounded-lg shadow-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-700 text-xs text-slate-300 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Rol</th>
                <th scope="col" className="px-6 py-3">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700">
                  <td className="px-6 py-4 font-medium">{user.id}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'Administrador' 
                      ? 'bg-indigo-500 text-indigo-100' 
                      : 'bg-slate-600 text-slate-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;