const User = require('../models/user.model'); // Importamos nuestro Modelo
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Función para el inicio de sesión de un usuario con jwt
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El correo electrónico y la contraseña son requeridos.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    // Crea el "Payload" para el token.
    // Incluimos la información que queremos que el token "recuerde" sobre el usuario.
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
    // 3. Firma el token con nuestro secreto y establece una fecha de expiración.
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usamos la clave secreta de nuestro archivo .env
      { expiresIn: '1h' },    // El token será válido por 1 hora
      (err, token) => {
        if (err) throw err;
        // 4. Envía el token al cliente (junto con un mensaje de éxito).
        res.status(200).json({
          message: 'Inicio de sesión exitoso.',
          token: token // ¡Aquí está nuestra pulsera VIP!
        });
      }
    );

  } catch (error) {
    res.status(500).json({ message: 'Error inesperado en el servidor.', error: error.message });
  }
};


exports.loginWithSession = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // ✅ ¡Autenticación exitosa! Guardamos el usuario en la sesión.
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      message: 'Inicio de sesión con sesión exitoso.',
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error inesperado.', error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'No se pudo cerrar la sesión.' });
    }
    res.clearCookie('connect.sid'); // Limpia la cookie de sesión
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
  });
};
