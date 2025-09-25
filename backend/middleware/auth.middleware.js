// backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

// Este es nuestro middleware
const authMiddleware = (req, res, next) => {
  // 1. Obtener el token de la cabecera de autorización
  const authHeader = req.header('Authorization');

  // 2. Verificar si el token existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  // El formato del token es "Bearer <token>". Necesitamos separar la palabra "Bearer".
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Formato de token inválido.' });
  }

  try {
    // 3. Verificar la validez del token usando nuestro secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Si el token es válido, adjuntamos el payload decodificado (con los datos del usuario)
    // a la petición (req.user) para que las rutas protegidas puedan usarlo.
    req.user = decoded.user;

    // 5. Llamamos a 'next()' para pasar a la siguiente función en la cadena (el controlador)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};

module.exports = authMiddleware;