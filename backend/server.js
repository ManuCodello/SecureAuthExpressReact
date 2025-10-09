// backend/server.js (VERSIÓN CORREGIDA Y MEJORADA)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const csrf = require('csurf');
const helmet = require('helmet'); // Middleware para cabeceras de seguridad
const jwt = require('jsonwebtoken'); // Usado para verificar JWT en /auth/status (solo lectura)
const db = require('./config/database');

// --- Rutas ---
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// --- Middlewares ---

// 0. Helmet: añade cabeceras HTTP seguras mínimas. No cambia la lógica de la app
//    y ayuda a mitigar ataques comunes (clickjacking, sniffing, XSS hints, etc.).
app.use(helmet());

// 1. Logger simple para ver todas las peticiones entrantes (útil en desarrollo)
app.use((req, res, next) => {
  console.log(`Petición entrante: ${req.method} ${req.url}`);
  next();
});

// 2. Opciones de CORS explícitas y robustas
//    origin: front en dev (Vite), credentials: true para enviar cookies HttpOnly
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
};
app.use(cors(corsOptions));
// Nota: si necesitas probar desde otra URL, actualiza `origin` o usa una función dinámica.


// 3. Middlewares para parsear el cuerpo y las cookies
app.use(express.json());
app.use(cookieParser());

// 4. Configuración de Sesión
//    Guardamos sesiones en sqlite para persistencia simple en desarrollo.
//    Las cookies de sesión están marcadas HttpOnly para prevenir XSS en el cliente.
app.use(
  session({
    store: new SQLiteStore({
      db: 'database.sqlite',
      dir: './config',
      table: 'sessions',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      secure: false, // en producción debe ser true si usas HTTPS
      httpOnly: true, // importante: evita acceso por JavaScript (mitiga XSS)
      sameSite: 'lax',
    },
  })
);

// 5. Configuración de CSRF
//    csurf usa cookies (cookie: true) y protege rutas no seguras; las peticiones GET
//    siguen permitidas y podremos tener un endpoint GET de comprobación de estado.
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// --- Endpoints auxiliares y de utilidad ---

// Endpoint para obtener el token CSRF (útil para clientes que necesitan incluirlo)
app.get('/api/csrf-token', (req, res) => {
  // Devuelve el token CSRF para usar en peticiones POST/PUT/DELETE desde el frontend
  res.json({ csrfToken: req.csrfToken() });
});

// Endpoint "silencioso" para comprobar el estado de autenticación del cliente.
// - No devuelve 401 para usuarios anónimos: en su lugar devuelve { user: null } y 200.
// - Esto evita que el frontend vea errores 401 en la carga inicial cuando no hay sesión.
// - Si existe una sesión en server (req.session.user) se devuelve esa info.
// - Si el cliente envía un JWT en Authorization: Bearer <token>, intentamos
//   verificarlo y devolver una forma mínima del usuario. No modificamos estado.
app.get('/api/auth/status', (req, res) => {
  try {
    // 1) Comprobación usando sesión (cookie de sesión)
    if (req.session && req.session.user) {
      // Devolver solo campos seguros (si quieres, mapea aquí a { id, email, role })
      return res.status(200).json({ user: req.session.user });
    }

    // 2) Comprobación usando JWT en header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Opcional: mapear payload a una forma segura antes de devolver
        const safeUser = {
          id: payload.id || payload._id || null,
          email: payload.email || null,
          role: payload.role || null,
        };
        return res.status(200).json({ user: safeUser });
      } catch (err) {
        // Token inválido: no autenticado. No devolvemos 401 para la comprobación.
      }
    }

    // 3) Si no hay sesión ni JWT válido, devolvemos user: null con 200 OK
    return res.status(200).json({ user: null });
  } catch (err) {
    // En caso de error inesperado devolvemos user:null (no exponemos detalles)
    return res.status(200).json({ user: null });
  }
});

// --- Rutas de la aplicación ---
// Se usan prefijos: /api/auth, /api/profile, /api/users
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});