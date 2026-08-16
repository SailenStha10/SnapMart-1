import express from 'express'
import { createOrder, listOrders } from '../controllers/orderController.js'
import adminMiddleware from '../middlewares/adminMiddleware.js'

const router = express.Router()

// create order (public — user token optional)
router.post('/', createOrder)

// list orders (admin only)
router.get('/', adminMiddleware, listOrders)

export default router
