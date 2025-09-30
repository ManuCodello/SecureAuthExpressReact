// backend/seed-admin.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// --- CONFIGURACIÓN ---
// 👇 ¡CAMBIA ESTOS VALORES POR LOS DE TU FUTURO ADMINISTRADOR!
const ADMIN_EMAIL = 'admin@passport.com';
const ADMIN_PASSWORD = 'unacontraseñasegura'; // Opcional: para crear si no existe
// -------------------

// Ruta a la base de datos
const dbPath = path.resolve(__dirname, 'config', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('❌ Error al conectar con la base de datos:', err.message);
  }
  console.log('✅ Conectado a la base de datos para la siembra.');
});

// Usamos serialize para ejecutar las operaciones en orden
db.serialize(() => {
  const findSql = `SELECT * FROM users WHERE email = ?`;

  db.get(findSql, [ADMIN_EMAIL], (err, row) => {
    if (err) {
      return console.error('❌ Error al buscar el usuario:', err.message);
    }

    if (row) {
      // --- CASO 1: El usuario ya existe, solo lo promovemos ---
      if (row.role === 'Administrador') {
        console.log(`✅ El usuario ${ADMIN_EMAIL} ya es un Administrador.`);
        db.close();
        return;
      }

      const updateSql = `UPDATE users SET role = ? WHERE email = ?`;
      db.run(updateSql, ['Administrador', ADMIN_EMAIL], function(err) {
        if (err) {
          return console.error('❌ Error al promover al usuario:', err.message);
        }
        console.log(`✅ ¡Éxito! El usuario ${ADMIN_EMAIL} ha sido promovido a Administrador.`);
        db.close();
      });

    } else {
      // --- CASO 2: El usuario no existe, lo creamos como Administrador ---
      console.log(`⚠️  Usuario no encontrado. Creando ${ADMIN_EMAIL} como Administrador...`);
      bcrypt.hash(ADMIN_PASSWORD, 10, (err, hashedPassword) => {
        if (err) {
          return console.error('❌ Error al hashear la contraseña:', err.message);
        }

        const insertSql = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
        db.run(insertSql, [ADMIN_EMAIL, hashedPassword, 'Administrador'], function(err) {
          if (err) {
            return console.error('❌ Error al crear el usuario administrador:', err.message);
          }
          console.log(`✅ ¡Éxito! Se ha creado el usuario Administrador con ID: ${this.lastID}.`);
          db.close();
        });
      });
    }
  });
});