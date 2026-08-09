import express from 'express'
import adminMiddleware from '../middlewares/adminMiddleware.js'
import { listUsers, getStats, getSettings, updateSettings } from '../controllers/adminController.js'

const router = express.Router()

router.use(adminMiddleware)

router.get('/users', listUsers)
router.get('/stats', getStats)
router.get('/settings', getSettings)
router.put('/settings', updateSettings)

export default router
