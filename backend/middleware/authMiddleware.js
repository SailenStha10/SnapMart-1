// Placeholder auth middleware
export default function authMiddleware(req, res, next){
  // Example: attach mock user for development
  req.user = { id: 'dev-user' }
  next()
}
