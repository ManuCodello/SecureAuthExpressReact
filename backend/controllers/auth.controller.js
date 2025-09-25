const User = require('../models/user.model'); // Importamos nuestro Modelo
const bcrypt = require('bcryptjs');

// La lógica para registrar un usuario
exports.register = async (req, res) => {
  try {
    const { email, password, role = 'Usuario' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El correo electrónico y la contraseña son requeridos.' });
    }
    
    // El controlador llama al Modelo para verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    // El controlador maneja la lógica de negocio (hashear la contraseña)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword, role };
    
    // El controlador llama al Modelo para crear el usuario
    const result = await User.create(newUser);
    
    // El controlador envía la respuesta (la "Vista")
    res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: result.id });

  } catch (error) {
    // Manejo de errores
    if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }
    res.status(500).json({ message: 'Error inesperado en el servidor.', error: error.message });
  }
};
