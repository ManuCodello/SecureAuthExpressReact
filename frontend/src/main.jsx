// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Importa BrowserRouter
import App from './App';
import { AuthProvider } from './context/auth.context'; // 👈 Importa el AuthProvider 
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Envuelve la App */}
      <AuthProvider> {/* 👈 2. Envuelve la App con el Proveedor */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


