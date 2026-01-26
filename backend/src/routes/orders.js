const express = require('express');
const { authenticate } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:order_number', authenticate, orderController.getByOrderNumber);

module.exports = router;
