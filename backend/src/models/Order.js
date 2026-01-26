const db = require('./database');

const Order = {
  create: async (data) => {
    const result = await db.run(
      `INSERT INTO orders 
       (user_id, order_number, customer_name, customer_email, phone, address, city, postal_code, country, 
        subtotal, shipping_cost, tax, total, status, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id || null,
        data.order_number,
        data.customer_name,
        data.customer_email,
        data.phone,
        data.address,
        data.city,
        data.postal_code,
        data.country,
        data.subtotal,
        data.shipping_cost || 0,
        data.tax || 0,
        data.total,
        'pending',
        data.payment_method || 'other',
        data.notes || null
      ]
    );
    return result.id;
  },

  addItem: async (orderId, productId, variantId, quantity, unitPrice) => {
    return db.run(
      `INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, productId, variantId || null, quantity, unitPrice]
    );
  },

  findById: async (id) => {
    return db.get('SELECT * FROM orders WHERE id = ?', [id]);
  },

  findByOrderNumber: async (orderNumber) => {
    return db.get('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
  },

  getItems: async (orderId) => {
    return db.all(`
      SELECT oi.*, p.title, p.slug, pv.size, pv.color, pv.sku
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_variants pv ON oi.variant_id = pv.id
      WHERE oi.order_id = ?
    `, [orderId]);
  },

  findByUserId: async (userId) => {
    return db.all(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  },

  findAll: async (filters = {}) => {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return db.all(sql, params);
  },

  updateStatus: async (id, status) => {
    await db.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  }
};

module.exports = Order;
