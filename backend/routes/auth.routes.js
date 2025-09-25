const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Cuando una petición POST llegue a '/register', se ejecutará la función 'register' del controlador de autenticación.
router.post('/register', authController.register);

// Aquí añadiremos la ruta para '/login' 
router.post('/login', authController.login);

module.exports = router;
