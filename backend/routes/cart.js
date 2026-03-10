// ============================================================
// routes/cart.js — Shopping Cart Routes
//   GET    /api/cart              — Get cart
//   POST   /api/cart              — Add product
//   PUT    /api/cart/:productId   — Update quantity
//   DELETE /api/cart/:productId   — Delete product
//   DELETE /api/cart              — Clear cart
// ============================================================
const express = require("express");
const router  = express.Router();
const { carts, products } = require("../data/store");
const { protect }         = require("../middleware/auth");

// ── Helper: Build cart response with product data ──
const buildCart = (userId) => {
  const items = carts[userId] || [];
  const enriched = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  });
  const subtotal = enriched.reduce(
    (s, i) => s + (i.product?.price || 0) * i.qty, 0
  );
  return {
    items: enriched,
    subtotal: parseFloat(subtotal.toFixed(2)),
    itemCount: items.reduce((s, i) => s + i.qty, 0),
  };
};

// ────────────────────────────────────────────────
//  GET /api/cart
// ────────────────────────────────────────────────
router.get("/", protect, (req, res) => {
  res.json({ success: true, cart: buildCart(req.user.id) });
});

// ────────────────────────────────────────────────
//  POST /api/cart — Add or increase quantity
// ────────────────────────────────────────────────
router.post("/", protect, (req, res) => {
  const { productId, qty = 1, shade } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  if (!carts[req.user.id]) carts[req.user.id] = [];

  const existing = carts[req.user.id].find(
    (i) => i.productId === productId && i.shade === shade
  );

  if (existing) {
    existing.qty = Math.min(existing.qty + parseInt(qty), 10);
  } else {
    carts[req.user.id].push({ productId, qty: parseInt(qty), shade: shade || null });
  }

  res.json({ success: true, cart: buildCart(req.user.id) });
});

// ────────────────────────────────────────────────
//  PUT /api/cart/:productId — Update quantity
// ────────────────────────────────────────────────
router.put("/:productId", protect, (req, res) => {
  const { qty, shade } = req.body;
  if (!carts[req.user.id])
    return res.status(404).json({ success: false, message: "Cart is empty" });

  const item = carts[req.user.id].find((i) => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ success: false, message: "Product not in cart" });

  item.qty = Math.max(1, Math.min(parseInt(qty), 10));
  if (shade !== undefined) item.shade = shade;

  res.json({ success: true, cart: buildCart(req.user.id) });
});

// ────────────────────────────────────────────────
//  DELETE /api/cart/:productId — Remove product
// ────────────────────────────────────────────────
router.delete("/:productId", protect, (req, res) => {
  if (!carts[req.user.id]) {
    return res.json({ success: true, cart: buildCart(req.user.id) });
  }
  carts[req.user.id] = carts[req.user.id].filter(
    (i) => i.productId !== req.params.productId
  );
  res.json({ success: true, cart: buildCart(req.user.id) });
});

// ────────────────────────────────────────────────
//  DELETE /api/cart — Clear entire cart
// ────────────────────────────────────────────────
router.delete("/", protect, (req, res) => {
  carts[req.user.id] = [];
  res.json({ success: true, cart: buildCart(req.user.id) });
});

module.exports = router;
