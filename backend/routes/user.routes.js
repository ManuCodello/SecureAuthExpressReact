// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/rol.middleware');
const { body, param, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', errors: errors.array() });
  }
  next();
};

// Definimos la ruta POST para crear un usuario
// La petición debe pasar por estas 3 etapas en orden:
// 1. authMiddleware -> ¿Estás autenticado?
// 2. checkRole(['Administrador']) -> ¿Tienes el rol de Administrador?
// 3. userController.createUser -> Si pasaste los dos anteriores, ejecuta la lógica.
router.post(
  '/create',
  authMiddleware,
  checkRole(['Administrador']),
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim(),
    body('role').isIn(['Usuario', 'Administrador'])
  ],
  handleValidation,
  userController.createUser
);
router.get('/', authMiddleware, checkRole(['Administrador']), userController.getAllUsers);

// Eliminar tu propia cuenta
router.delete('/me', authMiddleware, userController.deleteSelf);

// Admin: eliminar un usuario por id
router.delete(
  '/:id',
  authMiddleware,
  checkRole(['Administrador']),
  [param('id').isInt().toInt()],
  handleValidation,
  userController.deleteById
);

// Admin: actualizar rol
router.patch(
  '/:id/role',
  authMiddleware,
  checkRole(['Administrador']),
  [
    param('id').isInt().toInt(),
    body('role').isIn(['Usuario', 'Administrador'])
  ],
  handleValidation,
  userController.updateRole
);

module.exports = router;