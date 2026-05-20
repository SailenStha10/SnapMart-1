import express from 'express'
import {
  listWishlist,
  addWishlistItem,
  removeWishlistItem
} from '../controllers/wishlistController.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', listWishlist)
router.post('/', addWishlistItem)
router.delete('/:productId', removeWishlistItem)

export default router