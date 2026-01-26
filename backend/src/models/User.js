const db = require('./database');

const User = {
  findByEmail: async (email) => {
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  findById: async (id) => {
    return db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  },

  create: async (name, email, passwordHash) => {
    const result = await db.run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'customer']
    );
    return result.id;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await db.run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};

module.exports = User;
