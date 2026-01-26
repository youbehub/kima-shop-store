const db = require('./database');

const Category = {
  findAll: async () => {
    return db.all('SELECT * FROM categories ORDER BY name ASC');
  },

  findBySlug: async (slug) => {
    return db.get('SELECT * FROM categories WHERE slug = ?', [slug]);
  },

  findById: async (id) => {
    return db.get('SELECT * FROM categories WHERE id = ?', [id]);
  },

  create: async (name, slug, description = null, imageUrl = null) => {
    const result = await db.run(
      'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
      [name, slug, description, imageUrl]
    );
    return result.id;
  },

  update: async (id, data) => {
    const fields = ['updated_at = CURRENT_TIMESTAMP'];
    const values = [];
    
    if (data.name) { fields.unshift('name = ?'); values.push(data.name); }
    if (data.slug) { fields.unshift('slug = ?'); values.push(data.slug); }
    if (data.description) { fields.unshift('description = ?'); values.push(data.description); }
    if (data.imageUrl) { fields.unshift('image_url = ?'); values.push(data.imageUrl); }
    
    values.push(id);
    await db.run(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete: async (id) => {
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
  }
};

module.exports = Category;
