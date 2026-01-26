const db = require('../src/models/database');

async function seed() {
  try {
    await db.open();
    
    // Disable foreign key checks temporarily
    await db.run('PRAGMA foreign_keys = OFF');
    
    // Clear existing data
    await db.run('DELETE FROM product_images');
    await db.run('DELETE FROM product_variants');
    await db.run('DELETE FROM cart_items');
    await db.run('DELETE FROM carts');
    await db.run('DELETE FROM order_items');
    await db.run('DELETE FROM orders');
    await db.run('DELETE FROM products');
    await db.run('DELETE FROM categories');
    await db.run('DELETE FROM users');
    
    // Re-enable foreign key checks
    await db.run('PRAGMA foreign_keys = ON');
    
    console.log('✅ Tables cleared');
    
    // Insert categories
    await db.run(
      `INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)`,
      ['Dresses', 'dresses', 'Beautiful dresses']
    );
    await db.run(
      `INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)`,
      ['Abayas', 'abayas', 'Elegant abayas']
    );
    await db.run(
      `INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)`,
      ['Tops', 'tops', 'Tops and blouses']
    );
    console.log('✅ Categories inserted');
    
    // Get the category IDs to ensure we use the correct ones
    const dressCat = await db.get('SELECT id FROM categories WHERE slug = ?', ['dresses']);
    const abayaCat = await db.get('SELECT id FROM categories WHERE slug = ?', ['abayas']);
    const topsCat = await db.get('SELECT id FROM categories WHERE slug = ?', ['tops']);
    
    // Insert products with correct category IDs
    await db.run(
      `INSERT INTO products (title, slug, description, price, category_id, featured, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Black Dress', 'black-dress', 'Elegant black dress', 199.99, dressCat.id, 1, '/assets/images/dress-1.jpg']
    );
    await db.run(
      `INSERT INTO products (title, slug, description, price, category_id, featured, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['White Abaya', 'white-abaya', 'Premium white abaya', 89.99, abayaCat.id, 1, '/assets/images/abaya-1.jpg']
    );
    console.log('✅ Products inserted');
    
    // Insert users first (before orders that reference users)
    await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Admin', 'admin@store.com', '$2a$10$YJmU0I9qNnWwHKpO3nw3TuBPg9s6FhJq6N9.K9m7L8J5K3J5K3J5K', 'admin']
    );
    console.log('✅ Users inserted');
    
    // Get product IDs
    const dressProd = await db.get('SELECT id FROM products WHERE slug = ?', ['black-dress']);
    const abayaProd = await db.get('SELECT id FROM products WHERE slug = ?', ['white-abaya']);
    
    // NOW insert product variants with correct product IDs
    await db.run(
      `INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES (?, ?, ?, ?, ?)`,
      [dressProd.id, 'M', 'Black', 'DRESS-001-M-BLK', 10]
    );
    await db.run(
      `INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES (?, ?, ?, ?, ?)`,
      [abayaProd.id, 'L', 'White', 'ABAYA-001-L-WHT', 15]
    );
    console.log('✅ Variants inserted');
    console.log('🌱 Database seeded successfully!');
    
    await db.close();
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
