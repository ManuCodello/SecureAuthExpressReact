const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Configuración del limitador
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita cada IP a 5 peticiones de login por ventana de tiempo
  message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos'
});

// Middleware para gestionar errores de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', errors: errors.array() });
  }
  next();
};

// Cuando una petición POST llegue a '/register', se ejecutará la función 'register' del controlador de autenticación.
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').trim(),
  ],
  handleValidation,
  authController.register
);

// Aquí añadiremos la ruta para '/login' 
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Contraseña inválida').trim(),
  ],
  handleValidation,
  authController.login
);
router.post(
  '/login-session',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Contraseña inválida').trim(),
  ],
  handleValidation,
  authController.loginWithSession
);
router.post('/logout', authController.logout);

module.exports = router;
