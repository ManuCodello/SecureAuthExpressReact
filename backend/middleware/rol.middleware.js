// backend/middleware/role.middleware.js

// Este es un "generador de middlewares". Toma un array de roles permitidos
// y devuelve un middleware que verifica si el usuario tiene uno de esos roles.
const checkRole = (roles) => {
  return (req, res, next) => {
    // Obtenemos el usuario de la sesión O del token JWT
    const user = req.user || req.session.user;

    if (!user) {
      return res.status(401).json({ message: 'No autenticado.' });
    }
    
    // Verificamos si el rol del usuario está en la lista de roles permitidos
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Acceso prohibido. No tienes el rol requerido.' });
    }
    
    // Si tiene el rol, continuamos
    next();
  };
};

module.exports = checkRole;