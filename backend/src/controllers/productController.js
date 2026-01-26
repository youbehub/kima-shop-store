const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category_id: req.query.category_id,
      minPrice: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
      maxPrice: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
      sort: req.query.sort,
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 12,
      featured: req.query.featured === 'true'
    };

    const products = await Product.findAll(filters);
    const total = await Product.count(filters);

    // Enrichir avec images et variantes
    for (let product of products) {
      product.images = await Product.getImages(product.id);
      product.variants = await Product.getVariants(product.id);
    }

    res.json({
      products,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        pages: Math.ceil(total / filters.limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
};

const getById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      product = await Product.findBySlug(req.params.id);
    }

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    product.images = await Product.getImages(product.id);
    product.variants = await Product.getVariants(product.id);

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
};

const getFeatured = async (req, res) => {
  try {
    const products = await Product.findAll({ featured: true, limit: 8 });

    for (let product of products) {
      product.images = await Product.getImages(product.id);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
};

// Créer un produit
const create = async (req, res) => {
  try {
    const { title, description, price, category_id, featured } = req.body;

    // Validation
    if (!title || !price || !category_id) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Titre, prix et catégorie sont requis' });
    }

    // Créer le produit
    const product = await Product.create({
      title,
      description: description || '',
      price: parseFloat(price),
      category_id: parseInt(category_id),
      featured: featured === 'true' || featured === true ? 1 : 0
    });

    // Ajouter l'image si présente
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      await Product.addImage(product.id, imagePath);
    }

    res.status(201).json({ 
      message: 'Produit créé avec succès',
      product 
    });
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erreur création produit:', error);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
};

// Modifier un produit
const update = async (req, res) => {
  try {
    const { title, description, price, category_id, featured } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Mettre à jour
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category_id) updateData.category_id = parseInt(category_id);
    if (featured !== undefined) updateData.featured = featured === 'true' ? 1 : 0;

    await Product.update(req.params.id, updateData);

    // Ajouter l'image si présente
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      await Product.addImage(req.params.id, imagePath);
    }

    res.json({ message: 'Produit modifié avec succès' });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Erreur modification produit:', error);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
};

// Supprimer un produit
const remove = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Supprimer les images
    const images = await Product.getImages(req.params.id);
    for (let img of images) {
      const filePath = path.join(__dirname, '../../..' + img.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Product.delete(req.params.id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAll,
  getById,
  getFeatured,
  create,
  update,
  remove
};
