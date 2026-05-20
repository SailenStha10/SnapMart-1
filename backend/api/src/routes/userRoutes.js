import express from 'express'
import {
  getProfile,
  updateProfile,
  changePassword,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/userController.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/change-password', changePassword)

router.get('/addresses', listAddresses)
router.post('/addresses', createAddress)
router.put('/addresses/:addressId', updateAddress)
router.delete('/addresses/:addressId', deleteAddress)

export default router