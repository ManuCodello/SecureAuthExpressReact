const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');

// Configuración del limitador
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita cada IP a 5 peticiones de login por ventana de tiempo
  message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos'
});

// Cuando una petición POST llegue a '/register', se ejecutará la función 'register' del controlador de autenticación.
router.post('/register', authController.register);

// Aquí añadiremos la ruta para '/login' 
router.post('/login', loginLimiter, authController.login);
router.post('/login-session', loginLimiter, authController.loginWithSession);
router.post('/logout', authController.logout);

module.exports = router;
