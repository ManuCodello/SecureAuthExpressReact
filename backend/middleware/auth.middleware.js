// backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist.model');

// Este es nuestro middleware
const authMiddleware = async (req, res, next) => {
  // 1) Intentar autenticación por JWT si viene en la cabecera
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Formato de token inválido.' });
    }
    try {
      // Rechazar si el token está en la lista negra
      const blacklisted = await TokenBlacklist.isBlacklisted(token);
      if (blacklisted) {
        return res.status(401).json({ message: 'Token invalidado. Inicie sesión nuevamente.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token no válido.' });
    }
  }

  // 2) Si no hay JWT, intentar con sesión existente
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // 3) Si no hay ninguna forma de autenticación
  return res.status(401).json({ message: 'No autenticado.' });
};

module.exports = authMiddleware;