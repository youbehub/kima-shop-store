const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const db = require('./src/models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:8000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de santé (avant les autres routes)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Charger les routes après l'initialisation
(async () => {
  try {
    // Ouvrir la base de données
    await db.open();
    console.log('✅ Base de données connectée');

    // Charger les routes
    const authRoutes = require('./src/routes/auth');
    const productRoutes = require('./src/routes/products');
    const categoryRoutes = require('./src/routes/categories');
    const cartRoutes = require('./src/routes/cart');
    const orderRoutes = require('./src/routes/orders');
    const adminRoutes = require('./src/routes/admin');

    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/admin', adminRoutes);

    // 404
    app.use((req, res) => {
      res.status(404).json({ error: 'Route non trouvée' });
    });

    // Middleware d'erreur global
    app.use((error, req, res, next) => {
      console.error('Erreur:', error);
      res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
          ? 'Erreur serveur' 
          : error.message
      });
    });

    // Démarrer le serveur
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
})();

module.exports = app;
