const express = require('express');

const router = express.Router();

// Placeholder pour routes cart (localStorage utilisé côté frontend)
router.get('/', (req, res) => {
  res.json({ message: 'Cart API (utilise localStorage côté client)' });
});

module.exports = router;
