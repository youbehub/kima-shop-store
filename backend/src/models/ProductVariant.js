const db = require('./database');

const ProductVariant = {
  findById: async (id) => {
    return db.get('SELECT * FROM product_variants WHERE id = ?', [id]);
  },

  findByProductId: async (productId) => {
    return db.all('SELECT * FROM product_variants WHERE product_id = ? ORDER BY size, color', [productId]);
  },

  create: async (data) => {
    const result = await db.run(
      `INSERT INTO product_variants (product_id, size, color, sku, stock)
       VALUES (?, ?, ?, ?, ?)`,
      [data.product_id, data.size, data.color, data.sku, data.stock || 0]
    );
    return result.id;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.size) { fields.push('size = ?'); values.push(data.size); }
    if (data.color) { fields.push('color = ?'); values.push(data.color); }
    if (data.stock !== undefined) { fields.push('stock = ?'); values.push(data.stock); }

    if (fields.length === 0) return;

    values.push(id);
    await db.run(`UPDATE product_variants SET ${fields.join(', ')} WHERE id = ?`, values);
  }
};

module.exports = ProductVariant;
