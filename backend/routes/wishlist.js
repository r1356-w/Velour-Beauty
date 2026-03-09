// ============================================================
// routes/wishlist.js — مسارات قائمة المفضلة
//   GET  /api/wishlist/:productId — جلب المفضلة
//   POST /api/wishlist/:productId — إضافة/إزالة (Toggle)
// ============================================================
const express = require("express");
const router  = express.Router();
const { wishlists, products } = require("../data/store");
const { protect }             = require("../middleware/auth");

// GET /api/wishlist
router.get("/", protect, (req, res) => {
  const ids   = wishlists[req.user.id] || [];
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  res.json({ success: true, wishlist: items });
});

// POST /api/wishlist/:productId — Toggle
router.post("/:productId", protect, (req, res) => {
  if (!wishlists[req.user.id]) wishlists[req.user.id] = [];

  const idx = wishlists[req.user.id].indexOf(req.params.productId);
  let action;

  if (idx === -1) {
    wishlists[req.user.id].push(req.params.productId);
    action = "added";
  } else {
    wishlists[req.user.id].splice(idx, 1);
    action = "removed";
  }

  res.json({ success: true, action, wishlist: wishlists[req.user.id] });
});

module.exports = router;
