const express = require('express');
const { getCart, updateCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, updateCart);

module.exports = router;
