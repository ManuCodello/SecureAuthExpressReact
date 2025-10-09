// backend/middleware/role.middleware.js

const jwt = require('jsonwebtoken');

// Este es un "generador de middlewares". Toma un array de roles permitidos
// y devuelve un middleware que verifica si el usuario tiene uno de esos roles.
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      let user = null;

      // Primero intentamos obtener el usuario de la sesión
      if (req.session && req.session.user) {
        user = req.session.user;
      }
      // Si no hay usuario en la sesión, intentamos obtenerlo del token
      else {
        const token = req.cookies.sessionToken || req.cookies.accessToken;
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = decoded.user;
        }
      }

      if (!user) {
        return res.status(401).json({ 
          message: 'No autenticado.',
          isAuthenticated: false 
        });
      }
      
      // Verificamos si el rol del usuario está en la lista de roles permitidos
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Acceso prohibido. No tienes el rol requerido.',
          isAuthenticated: true 
        });
      }
      
      // Guardamos el usuario en el request para uso posterior
      req.user = user;
      
      // Si tiene el rol, continuamos
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Error de autenticación',
        isAuthenticated: false,
        error: error.message 
      });
    }
  };
};

module.exports = checkRole;