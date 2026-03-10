// ============================================================
// middleware/auth.js — JWT Authentication
// ============================================================
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

/**
 * protect — Protects routes that require authentication
 * Verifies Bearer token in Authorization header
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized — No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * adminOnly — Restricts access to admins only
 * Must be used after protect()
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden — Admin privileges required" });
  }
  next();
};

module.exports = { protect, adminOnly };
