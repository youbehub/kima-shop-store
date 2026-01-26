const db = require('./database');

const Product = {
  findAll: async (filters = {}) => {
    let sql = `
      SELECT 
        p.*, 
        c.name as category_name,
        COUNT(DISTINCT pi.id) as image_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.category_id) {
      sql += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.minPrice !== undefined) {
      sql += ' AND p.price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      sql += ' AND p.price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.featured) {
      sql += ' AND p.featured = 1';
    }

    sql += ' GROUP BY p.id';

    if (filters.sort === 'price_asc') {
      sql += ' ORDER BY p.price ASC';
    } else if (filters.sort === 'price_desc') {
      sql += ' ORDER BY p.price DESC';
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }

    // Pagination
    const limit = filters.limit || 12;
    const offset = ((filters.page || 1) - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return db.all(sql, params);
  },

  findById: async (id) => {
    return db.get(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
  },

  findBySlug: async (slug) => {
    return db.get(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [slug]);
  },

  getVariants: async (productId) => {
    return db.all(
      'SELECT * FROM product_variants WHERE product_id = ? ORDER BY size, color',
      [productId]
    );
  },

  getImages: async (productId) => {
    return db.all(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
      [productId]
    );
  },

  create: async (data) => {
    const result = await db.run(
      `INSERT INTO products (title, slug, description, price, category_id, featured, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.title, data.slug, data.description, data.price, data.category_id, data.featured || 0, data.image_url || null]
    );
    return result.id;
  },

  update: async (id, data) => {
    const fields = ['updated_at = CURRENT_TIMESTAMP'];
    const values = [];
    
    if (data.title) { fields.unshift('title = ?'); values.push(data.title); }
    if (data.slug) { fields.unshift('slug = ?'); values.push(data.slug); }
    if (data.description) { fields.unshift('description = ?'); values.push(data.description); }
    if (data.price !== undefined) { fields.unshift('price = ?'); values.push(data.price); }
    if (data.category_id) { fields.unshift('category_id = ?'); values.push(data.category_id); }
    if (data.featured !== undefined) { fields.unshift('featured = ?'); values.push(data.featured); }
    if (data.image_url) { fields.unshift('image_url = ?'); values.push(data.image_url); }
    
    values.push(id);
    await db.run(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete: async (id) => {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  },

  count: async (filters = {}) => {
    let sql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];

    if (filters.search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.category_id) {
      sql += ' AND category_id = ?';
      params.push(filters.category_id);
    }

    const result = await db.get(sql, params);
    return result.total || 0;
  }
};

module.exports = Product;
