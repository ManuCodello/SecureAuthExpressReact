// 1. Importar los módulos necesarios
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 2. Definir la ruta al archivo de la base de datos (¡ESTA ES LA LÍNEA QUE CAMBIAMOS!)
// Ahora creará el archivo 'database.sqlite' en el mismo directorio que este archivo (la carpeta 'config')
const dbPath = path.resolve(__dirname, 'database.sqlite');

// 3. Crear y conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  // ... el resto del archivo permanece exactamente igual ...
  if (err) {
    console.error('❌ Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos SQLite en config/.');
  }
});

// ... el resto del archivo no cambia ...
db.serialize(() => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Usuario',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('❌ Error al crear la tabla "users":', err.message);
    } else {
        console.log('🔑 Tabla "users" lista.');
    }
  });

  const blacklistSql = `
    CREATE TABLE IF NOT EXISTS tokens_blacklist (
      token TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL
    )
  `;
  db.run(blacklistSql, (err) => {
    if (err) {
      console.error('❌ Error al crear la tabla "tokens_blacklist":', err.message);
    } else {
      console.log('🛡️  Tabla "tokens_blacklist" lista.');
    }
  });
});


module.exports = db;