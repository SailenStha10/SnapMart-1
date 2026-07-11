import express from 'express'
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  initiateCheckout, 
  abandonCheckout,
  updateCart 
} from '../controllers/cartController.js'
import { requireAuth, requireGuestOrAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', requireGuestOrAuth, getCart)
router.post('/add', requireGuestOrAuth, addToCart)
router.put('/item', requireGuestOrAuth, updateCartItem)
router.delete('/item/:productId', requireGuestOrAuth, removeFromCart)
router.delete('/', requireAuth, clearCart)
router.delete('/clear', requireGuestOrAuth, clearCart)
router.post('/checkout', requireGuestOrAuth, initiateCheckout)
router.post('/abandon', abandonCheckout)
router.post('/', requireGuestOrAuth, updateCart)

export default router
