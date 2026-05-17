// Placeholder auth middleware - sets user as admin in dev
export default function authMiddleware(req, res, next){
  req.user = { 
    id: 'dev-user',
    role: 'admin',  // admin by default in dev
    isAdmin: true
  }
  next()
}
