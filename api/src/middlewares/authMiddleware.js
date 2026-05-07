// Placeholder auth middleware
export default function authMiddleware(req, res, next){
  req.user = { id: 'dev-user' }
  next()
}
