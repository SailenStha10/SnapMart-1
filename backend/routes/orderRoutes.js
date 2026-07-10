const express = require('express')
const { createOrder, listOrders } = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, adminMiddleware, listOrders)

module.exports = router
