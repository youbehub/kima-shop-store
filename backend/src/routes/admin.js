const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuration multer pour uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Middleware d'authentification admin pour toutes les routes
router.use(authenticate);
router.use(authorize(['admin']));

// ====== ORDRES ======
router.get('/orders', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 20
    };

    const orders = await Order.findAll(filters);

    // Enrichir avec les articles
    for (let order of orders) {
      order.items = await Order.getItems(order.id);
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

router.patch('/orders/:id', [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Status invalide')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await Order.updateStatus(req.params.id, req.body.status);
    const order = await Order.findById(req.params.id);
    res.json({ message: 'Commande mise à jour', order });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande' });
  }
});

// ====== PRODUITS ======
router.get('/products', async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category_id: req.query.category_id,
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 20
    };

    const products = await Product.findAll(filters);

    for (let product of products) {
      product.images = await Product.getImages(product.id);
      product.variants = await Product.getVariants(product.id);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

router.post('/products', [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('slug').trim().notEmpty().withMessage('Le slug est requis'),
  body('description').trim().optional(),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être valide'),
  body('category_id').isInt().withMessage('La catégorie est requise')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productId = await Product.create({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      category_id: req.body.category_id,
      featured: req.body.featured || false,
      image_url: req.body.image_url || null
    });

    const product = await Product.findById(productId);
    res.status(201).json({ message: 'Produit créé', product });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    await Product.update(req.params.id, req.body);
    const product = await Product.findById(req.params.id);
    res.json({ message: 'Produit mis à jour', product });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

// ====== UPLOAD D'IMAGES ======
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploadée', url: fileUrl });
});

// ====== CATÉGORIES ======
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

router.post('/categories', [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('slug').trim().notEmpty().withMessage('Le slug est requis')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const categoryId = await Category.create(req.body.name, req.body.slug, req.body.description, req.body.image_url);
    const category = await Category.findById(categoryId);
    res.status(201).json({ message: 'Catégorie créée', category });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
  }
});

module.exports = router;
