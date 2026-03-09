// ============================================================
// middleware/auth.js — التحقق من JWT
// ============================================================
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

/**
 * protect — يحمي المسارات التي تتطلب تسجيل دخول
 * يتحقق من رمز Bearer في الـ Authorization header
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "غير مصرح — لم يُقدَّم رمز" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "الرمز غير صالح أو منتهي الصلاحية" });
  }
};

/**
 * adminOnly — يُقيِّد الوصول للمسؤولين فقط
 * يجب تشغيله بعد protect()
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "محظور — يلزم صلاحيات المسؤول" });
  }
  next();
};

module.exports = { protect, adminOnly };
