import { verifyToken } from '../utils/jwt.js'

function getTokenFromRequest(req) {
  const header = req.headers.authorization || ''

  if (!header.startsWith('Bearer ')) {
    return null
  }

  return header.slice(7).trim()
}

function authenticateRequest(req) {
  const token = getTokenFromRequest(req)

  if (!token) {
    return null
  }

  try {
    return verifyToken(token)
  } catch {
    return null
  }
}

export default function authMiddleware(req, res, next) {
  req.user = authenticateRequest(req)
  next()
}

export function requireAuth(req, res, next) {
  const user = authenticateRequest(req)

  if (!user) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  req.user = user
  return next()
}
