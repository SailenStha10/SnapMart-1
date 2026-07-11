import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { isDatabaseConnected } from '../../config/db.js'
import { getFallbackUser } from '../utils/fallbackData.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!isDatabaseConnected()) {
      if (token) {
        req.user = {
          id: getFallbackUser()._id,
          email: getFallbackUser().email,
          name: getFallbackUser().name,
          isGuest: getFallbackUser().isGuest,
          isAdmin: getFallbackUser().role === 'admin'
        }
        req.isAuthenticated = true
      } else {
        req.isAuthenticated = false
      }

      return next()
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      const user = await User.findById(decoded.id)

      if (user) {
        req.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          isGuest: user.isGuest,
          isAdmin: user.role === 'admin'
        }
        req.isAuthenticated = true
      } else {
        req.isAuthenticated = false
      }
    } else {
      req.isAuthenticated = false
    }

    next()
  } catch (error) {
    req.isAuthenticated = false
    next()
  }
}

export const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  next()
}

export const requireGuestOrAuth = (req, res, next) => {
  const sessionId = req.header('X-Session-ID')
  if (!req.isAuthenticated && !sessionId) {
    return res.status(401).json({ message: 'Authentication or session required' })
  }
  next()
}

export default authMiddleware
