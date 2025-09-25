// backend/routes/profile.routes.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware'); // 👈 Importamos nuestro guardián

// Para acceder a esta ruta, la petición PRIMERO debe pasar por 'authMiddleware'.
// Si el middleware da el visto bueno (llama a next()), entonces se ejecutará 'getMyProfile'.
router.get('/me', authMiddleware, profileController.getMyProfile);

module.exports = router;