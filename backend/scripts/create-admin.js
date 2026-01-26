const db = require('../src/models/database');
const { hashPassword } = require('../src/utils/helpers');

async function createAdmin() {
  try {
    await db.open();
    
    // Create admin with simple password
    const passwordHash = await hashPassword('admin123');
    
    await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Admin User', 'admin@kima.com', passwordHash, 'admin']
    );
    
    console.log('✅ Admin account created!');
    console.log('📧 Email: admin@kima.com');
    console.log('🔑 Password: admin123');
    
    await db.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
