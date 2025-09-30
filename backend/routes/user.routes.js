
// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/rol.middleware');

// Definimos la ruta POST para crear un usuario
// La petición debe pasar por estas 3 etapas en orden:
// 1. authMiddleware -> ¿Estás autenticado?
// 2. checkRole(['Administrador']) -> ¿Tienes el rol de Administrador?
// 3. userController.createUser -> Si pasaste los dos anteriores, ejecuta la lógica.
router.post('/create', authMiddleware, checkRole(['Administrador']), userController.createUser);
router.get('/', authMiddleware, checkRole(['Administrador']), userController.getAllUsers);

module.exports = router;