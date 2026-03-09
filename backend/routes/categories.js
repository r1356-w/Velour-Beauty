// ============================================================
// routes/categories.js — مسارات التصنيفات
//   GET /api/categories — جميع التصنيفات مع عدد المنتجات
// ============================================================
const express = require("express");
const router  = express.Router();
const { categories, products } = require("../data/store");

router.get("/", (req, res) => {
  const enriched = categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.categoryId === c.id).length,
  }));
  res.json({ success: true, categories: enriched });
});

module.exports = router;
