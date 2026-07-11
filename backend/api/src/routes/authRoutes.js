import express from 'express'
import { register, login, createGuestSession, forgotPassword, resetPassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/guest-session', createGuestSession)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
