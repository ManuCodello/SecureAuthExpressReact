const db = require('../config/database');

const TokenBlacklist = {
  add: (token, expiresAt) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT OR REPLACE INTO tokens_blacklist (token, expires_at) VALUES (?, ?)`;
      db.run(sql, [token, expiresAt], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  isBlacklisted: (token) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT 1 FROM tokens_blacklist WHERE token = ? AND expires_at > strftime('%s','now')`;
      db.get(sql, [token], (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      });
    });
  },

  pruneExpired: () => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM tokens_blacklist WHERE expires_at <= strftime('%s','now')`;
      db.run(sql, [], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = TokenBlacklist;
