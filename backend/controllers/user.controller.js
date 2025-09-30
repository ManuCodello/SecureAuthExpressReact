//backend/controllers/user.controller.js 

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Controlador para que un administrador cree un nuevo usuario (con cualquier rol)
exports.createUser = async (req, res) => {
  try {
    // Aquí sí aceptamos el rol, porque sabemos que esta ruta está protegida
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, contraseña y rol son requeridos.' });
    }

    if (!['Usuario', 'Administrador'].includes(role)) {
        return res.status(400).json({ message: 'El rol proporcionado no es válido.' });
    }
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword, role };
    
    const result = await User.create(newUser);
    
    // Por seguridad, no devolvemos la contraseña hasheada
    const createdUser = await User.findByEmail(email);
    delete createdUser.password;

    res.status(201).json({ message: 'Usuario creado exitosamente por un administrador.', user: createdUser });

  } catch (error) {
    res.status(500).json({ message: 'Error inesperado en el servidor.', error: error.message });
  }
};
// Controlador para obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios.', error: error.message });
  }
};
