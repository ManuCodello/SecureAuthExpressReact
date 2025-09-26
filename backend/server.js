// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const userRoutes = require('./routes/user.routes');

//cookies 
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// --- Rutas ---
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');

const app = express();

// --- Middlewares ---
// Opciones de CORS para permitir credenciales (cookies)
app.use(cors({
  origin: 'http://localhost:5173', // La URL de tu futuro frontend de React
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Usar cookie-parser

// --- Configuración de Sesión ---
app.use(
  session({
    store: new SQLiteStore({
      db: 'database.sqlite', // El nombre de nuestro archivo de BD
      dir: './config',       // La carpeta donde está
      table: 'sessions'      // Nombre de la tabla para las sesiones
    }),
    secret: process.env.SESSION_SECRET, // Un secreto diferente para las sesiones
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Duración de la cookie (7 días)
      secure: false, // Poner en 'true' en producción (cuando uses HTTPS)
      httpOnly: true, // La cookie no es accesible desde JavaScript en el cliente (protege de XSS)
      sameSite: 'lax' // Protección contra CSRF
    }
  })
);

// --- Configuración de CSRF ---
// Debe ir DESPUÉS de session y cookieParser
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// --- Rutas ---
app.get('/api/csrf-token', (req, res) => {
  // Endpoint para que el frontend obtenga el token CSRF inicial
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
