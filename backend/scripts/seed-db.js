const fs = require('fs');
const path = require('path');
const db = require('../src/models/database');

async function seedDatabase() {
  try {
    console.log('🌱 Ajout des données de test...');
    await db.open();
    
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf-8');
    await db.exec(seed);
    
    console.log('✅ Base de données remplie avec succès !');
    await db.close();
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
