const express = require('express');
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Routes publiques
router.get('/featured', productController.getFeatured);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Routes admin (protégées)
router.post('/', authenticate, upload.single('image'), productController.create);
router.put('/:id', authenticate, upload.single('image'), productController.update);
router.delete('/:id', authenticate, productController.remove);

module.exports = router;
