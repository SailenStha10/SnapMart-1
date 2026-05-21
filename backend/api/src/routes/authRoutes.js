import express from 'express'
import { register, login, createGuestSession } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/guest-session', createGuestSession)

export default router
