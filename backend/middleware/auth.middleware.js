// backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist.model');

const authMiddleware = async (req, res, next) => {
  try {
    // Primero verificar si hay una sesión activa
    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }

    // Si no hay sesión, buscar tokens
    const token = req.cookies.sessionToken || req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ 
        message: 'Acceso denegado. No autenticado.',
        isAuthenticated: false 
      });
    }

    // Verificar si el token está en la lista negra
    const blacklisted = await TokenBlacklist.isBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({ 
        message: 'Token invalidado. Por favor, inicie sesión de nuevo.',
        isAuthenticated: false 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ 
      message: 'Token no válido o expirado.',
      isAuthenticated: false,
      error: error.message 
    });
  }
};

module.exports = authMiddleware;