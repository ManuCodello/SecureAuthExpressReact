require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Importar el enrutador
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Bienvenido a la API de PassPort Inc. v2!' });
});

// "Enchufar" el enrutador de autenticación en la aplicación
// Todas las rutas definidas en auth.routes.js tendrán el prefijo '/api/auth'
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});