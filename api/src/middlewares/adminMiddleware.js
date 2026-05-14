export default function adminMiddleware(req, res, next) {
  // Allow if request has header x-admin: true (useful for dev) or req.user.role === 'admin'
  const isAdminHeader = String(req.headers["x-admin"] || "").toLowerCase() === "true";

  if (isAdminHeader) return next();

  if (req.user && (req.user.role === "admin" || req.user.isAdmin)) {
    return next();
  }

  return res.status(403).json({ message: "Admin access required" });
}
