const fs = require('fs');
const path = require('path');
const db = require('../src/models/database');

async function initializeDatabase() {
  try {
    console.log('🔌 Connexion à la base de données...');
    await db.open();
    
    console.log('📝 Exécution du schéma...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await db.exec(schema);
    
    console.log('✅ Base de données initialisée avec succès !');
    await db.close();
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
