const db = require('../config/database');

// Este objeto será nuestro Modelo. Contendrá todas las funciones para interactuar con la tabla 'users'.
const User = {
  // Función para crear un nuevo usuario. Devuelve una Promesa.
  create: (userData) => {
    return new Promise((resolve, reject) => {
      const { email, password, role } = userData;
      const sql = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
      
      // 'this' no funciona con funciones de flecha aquí, por eso usamos 'function(err)'
      db.run(sql, [email, password, role], function(err) {
        if (err) {
          // Si hay un error, rechazamos la promesa
          return reject(err);
        }
        // Si todo va bien, resolvemos la promesa con el ID del nuevo usuario
        resolve({ id: this.lastID });
      });
    });
  },

  // Función para encontrar un usuario por su email. También devuelve una Promesa.
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      
      // db.get se usa para obtener una sola fila
      db.get(sql, [email], (err, row) => {
        if (err) {
          return reject(err);
        }
        // Resolvemos con el usuario encontrado (o undefined si no se encontró)
        resolve(row);
      });
    });
  }
};

module.exports = User;
