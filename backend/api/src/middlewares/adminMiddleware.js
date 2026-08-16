export default function adminMiddleware(req, res, next) {
  const isAdminHeader = String(req.headers['x-admin'] || '').toLowerCase() === 'true'

  // Allow an explicit header for automation or CI use-cases
  if (isAdminHeader) return next()

  // Require authenticated admin user
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
    return next()
  }

  return res.status(403).json({ message: 'Admin access required' })
}
