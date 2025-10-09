// backend/controllers/auth.controller.js

const User = require('../models/user.model');
const TokenBlacklist = require('../models/tokenBlacklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// funcion para registrar 
exports.register = async (req, res) => {
  try {
    const { email, password, role = 'Usuario' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword, role };
    const result = await User.create(newUser);
    res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: result.id });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }
    res.status(500).json({ message: 'Error inesperado en el servidor.', error: error.message });
  }
};

// funcion para loguearse con jwt de autentificacion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
    // firmamos el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // Aumentamos a 24h

    // Configuración de cookie más robusta
    res.cookie('accessToken', token, {
      httpOnly: true, // Previene acceso desde JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS en producción
      sameSite: 'lax',
      path: '/', // Asegura que la cookie está disponible en toda la app
    });

    // Devolvemos datos del usuario y un mensaje de éxito
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: payload.user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error inesperado.', error: error.message });
  }
};

// FUNCIÓN 2: Login con Session tradicional (Stateful)
exports.loginWithSession = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
          return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        
        // Guardar datos del usuario EN EL SERVIDOR (en req.session)
        // Express-session automáticamente crea un session ID y lo envía en cookie
        req.session.user = { 
            id: user.id, 
            email: user.email, 
            role: user.role 
        };

        // Configurar opciones adicionales de la cookie de sesión
        // (esto depende de tu configuración de express-session)
        req.session.cookie.httpOnly = true;
        req.session.cookie.secure = process.env.NODE_ENV === 'production';
        req.session.cookie.sameSite = 'strict';
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 horas

        res.status(200).json({ 
            message: 'Inicio de sesión con sesión exitoso.', 
            user: req.session.user,
            isAuthenticated: true 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error inesperado.', error: error.message });
    }
};

exports.logout = async (req, res) => {
  try {
    // Añadir todos los tokens a la lista negra
    const tokens = [req.cookies.accessToken, req.cookies.sessionToken].filter(Boolean);
    for (const token of tokens) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
          await TokenBlacklist.add(token, decoded.exp);
        }  
      } catch (err) {
        console.error('Error al procesar token:', err);
      }
    }

    // Eliminamos todas las cookies de autenticación
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0)
    };

    res.cookie('accessToken', '', cookieOptions);
    res.cookie('sessionToken', '', cookieOptions);
    res.clearCookie('connect.sid');
    
    // Destruimos la sesión si existe
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
        }
      });
    }

    res.status(200).json({ 
      message: 'Sesión cerrada exitosamente.',
      isAuthenticated: false 
    });
  } catch (error) {
     res.status(500).json({ message: 'Error inesperado durante el logout.', error: error.message });
  }
};

// Verificar autenticación (funciona tanto para JWT como para sesión)
exports.verifyAuth = async (req, res) => {
  try {
    // Primero verificar si hay una sesión activa
    if (req.session && req.session.user) {
      const user = await User.findById(req.session.user.id);
      if (user) {
        return res.status(200).json({ 
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          },
          isAuthenticated: true,
          authType: 'session'
        });
      }
    }

    // Si no hay sesión, verificar el token JWT
    const token = req.cookies.sessionToken || req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ 
        message: 'No autenticado',
        isAuthenticated: false 
      });
    }

    // Verificar si el token está en la blacklist
    const isBlacklisted = await TokenBlacklist.isBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ 
        message: 'Token invalidado',
        isAuthenticated: false 
      });
    }

    // Verificar la firma del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario sigue existiendo en la BD
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'Usuario no encontrado',
        isAuthenticated: false 
      });
    }

    // Devolver datos seguros del usuario
    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      isAuthenticated: true,
      authType: 'token'
    });
  } catch (error) {
    // Si el token es inválido o expiró
    res.status(401).json({ 
      message: error.message || 'Token inválido',
      isAuthenticated: false 
    });
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};