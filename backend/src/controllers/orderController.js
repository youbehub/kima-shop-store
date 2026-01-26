const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateOrderNumber, formatCurrency } = require('../utils/helpers');
const { body, validationResult } = require('express-validator');

const createOrder = [
  body('customer_name').trim().notEmpty().withMessage('Le nom est requis'),
  body('customer_email').isEmail().withMessage('Email invalide'),
  body('phone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('address').trim().notEmpty().withMessage('L\'adresse est requise'),
  body('city').trim().notEmpty().withMessage('La ville est requise'),
  body('postal_code').trim().notEmpty().withMessage('Le code postal est requis'),
  body('country').trim().notEmpty().withMessage('Le pays est requis'),
  body('items').isArray({ min: 1 }).withMessage('Au moins un article est requis'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { customer_name, customer_email, phone, address, city, postal_code, country, items, subtotal, shipping_cost, tax } = req.body;

      const orderNumber = generateOrderNumber();
      const total = parseFloat(subtotal) + parseFloat(shipping_cost || 0) + parseFloat(tax || 0);

      const orderId = await Order.create({
        user_id: req.user?.id || null,
        order_number: orderNumber,
        customer_name,
        customer_email,
        phone,
        address,
        city,
        postal_code,
        country,
        subtotal: formatCurrency(subtotal),
        shipping_cost: formatCurrency(shipping_cost || 0),
        tax: formatCurrency(tax || 0),
        total: formatCurrency(total)
      });

      // Ajouter les articles
      for (let item of items) {
        await Order.addItem(orderId, item.product_id, item.variant_id || null, item.quantity, formatCurrency(item.unit_price));
      }

      const order = await Order.findById(orderId);
      const orderItems = await Order.getItems(orderId);

      res.status(201).json({
        message: 'Commande créée avec succès',
        order: { ...order, items: orderItems }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
  }
];

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);

    // Enrichir chaque commande avec ses articles
    for (let order of orders) {
      order.items = await Order.getItems(order.id);
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};

const getByOrderNumber = async (req, res) => {
  try {
    const order = await Order.findByOrderNumber(req.params.order_number);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Si l'utilisateur n'est pas admin et ce n'est pas sa commande
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    order.items = await Order.getItems(order.id);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getByOrderNumber
};
