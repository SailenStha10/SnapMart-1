import express from 'express'
import { listProducts, getProduct } from '../controllers/productController.js'

const router = express.Router()

router.get('/', listProducts)
router.get('/:id', getProduct)

export default router
