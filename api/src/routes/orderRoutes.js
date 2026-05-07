import express from 'express'
import { createOrder, listOrders } from '../controllers/orderController.js'

const router = express.Router()

router.post('/', createOrder)
router.get('/', listOrders)

export default router
