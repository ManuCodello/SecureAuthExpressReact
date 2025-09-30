// frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importamos las páginas
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage'; //

// Importamos los componentes "portero"
import IsPrivate from './components/IsPrivate';
import IsAnon from './components/IsAnon';
import IsAdmin from './components/IsAdmin';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          <h1 className="text-4xl font-extrabold">Bienvenido a PassPort Inc.</h1>
        </div>
      } />

      {/* Rutas para Usuarios NO Autenticados (envueltas en IsAnon) */}
      <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
      <Route path="/register" element={<IsAnon><RegisterPage /></IsAnon>} />

      {/* Rutas para Usuarios SÍ Autenticados (envueltas en IsPrivate) */}
      <Route path="/dashboard" element={<IsPrivate><DashboardPage /></IsPrivate>} />
      {/* 👇 3. Añade la nueva ruta protegida para administradores */}
      <Route path="/admin" element={<IsAdmin><AdminPage /></IsAdmin>} />
    </Routes>
  );
}

export default App;