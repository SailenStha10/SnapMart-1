export default function authMiddleware(req, res, next){
  req.user = { id: 'user' }
  next()
}
