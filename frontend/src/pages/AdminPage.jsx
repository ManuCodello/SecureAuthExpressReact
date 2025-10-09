// frontend/src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import userService from '../services/user.service';
import authService from '../services/auth.service';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadUsers = async () => {
    setError('');
    try {
      const response = await userService.getAllUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      if (err.response?.status === 401) {
        setError('No estás autenticado. Por favor, inicia sesión de nuevo.');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos de administrador para ver esta página.');
      } else {
        setError(err.response?.data?.message || 'Error al cargar los usuarios.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const withCsrf = async (fn) => {
    const csrf = await authService.getCsrfToken();
    return fn(csrf.data.csrfToken);
  };

  const handleToggleRole = async (u) => {
    try {
      setActionLoadingId(u.id);
      const newRole = u.role === 'Administrador' ? 'Usuario' : 'Administrador';
      await withCsrf(async (token) => {
        await userService.updateRole(u.id, newRole, token);
      });
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cambiar el rol.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`¿Eliminar al usuario ${u.email}?`)) return;
    try {
      setActionLoadingId(u.id);
      await withCsrf(async (token) => {
        await userService.deleteById(u.id, token);
      });
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario.');
    } finally {
      setActionLoadingId(null);
    }
  };

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
                <th scope="col" className="px-6 py-3">Acciones</th>
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
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleToggleRole(user)}
                      disabled={actionLoadingId === user.id}
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 disabled:opacity-60"
                    >
                      {user.role === 'Administrador' ? 'Hacer Usuario' : 'Hacer Admin'}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={actionLoadingId === user.id}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 disabled:opacity-60"
                    >
                      Eliminar
                    </button>
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