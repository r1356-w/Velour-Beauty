// ============================================================
// routes/auth.js — مسارات المصادقة
//   POST /api/auth/register — إنشاء حساب جديد
//   POST /api/auth/login    — تسجيل الدخول
//   GET  /api/auth/me       — جلب بيانات المستخدم الحالي
// ============================================================
const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

const router  = express.Router();
const { protect }                  = require("../middleware/auth");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config");

// ── مساعد: إنشاء رمز JWT ──────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// ── مساعد: إزالة كلمة المرور من الاستجابة ──────
const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});

// ────────────────────────────────────────────────
//  POST /api/auth/register
// ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق من الحقول المطلوبة
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "جميع الحقول مطلوبة" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
    }

    // التحقق من تكرار البريد الإلكتروني
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: "البريد الإلكتروني مسجل مسبقاً" });
    }

    // إنشاء المستخدم الجديد
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // سيتم تشفيرها تلقائياً via pre-save hook
      role: "user",
    });

    await newUser.save();
    const token = signToken(newUser);

    res.status(201).json({ success: true, token, user: safeUser(newUser) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "خطأ في الخادم" });
  }
});

// ────────────────────────────────────────────────
//  POST /api/auth/login
// ────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "البريد وكلمة المرور مطلوبان" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
    }

    const token = signToken(user);
    res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "خطأ في الخادم" });
  }
});

// ────────────────────────────────────────────────
//  GET /api/auth/me  (محمي)
// ────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, message: "خطأ في الخادم" });
  }
});

module.exports = router;
