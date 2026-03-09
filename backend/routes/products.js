// ============================================================
// routes/products.js — مسارات المنتجات
//   GET    /api/products           — قائمة المنتجات مع فلترة وترتيب
//   GET    /api/products/featured  — المنتجات المميزة
//   GET    /api/products/:id       — تفاصيل منتج
//   POST   /api/products           — إضافة منتج (admin)
//   PUT    /api/products/:id       — تعديل منتج (admin)
//   DELETE /api/products/:id       — حذف منتج (admin)
// ============================================================
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const { products, categories, reviews } = require("../data/store");
const { protect, adminOnly }            = require("../middleware/auth");

// ── مساعد: إضافة متوسط التقييم لكل منتج ──────
const withRating = (product) => {
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length
    ? parseFloat(
        (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
      )
    : 0;
  return { ...product, avgRating, reviewCount: productReviews.length };
};

// ────────────────────────────────────────────────
//  GET /api/products
// ────────────────────────────────────────────────
router.get("/", (req, res) => {
  const { category, search, sort, page = 1, limit = 12, tag } = req.query;

  let result = products.map(withRating);

  // فلترة بالتصنيف
  if (category) {
    const cat = categories.find((c) => c.slug === category || c.id === category);
    if (cat) result = result.filter((p) => p.categoryId === cat.id);
  }

  // فلترة بالبحث
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  // فلترة بالوسوم
  if (tag) result = result.filter((p) => p.tags?.includes(tag));

  // الترتيب
  if (sort === "price_asc")   result.sort((a, b) => a.price - b.price);
  if (sort === "price_desc")  result.sort((a, b) => b.price - a.price);
  if (sort === "rating")      result.sort((a, b) => b.avgRating - a.avgRating);
  if (sort === "bestseller")  result.sort((a, b) => b.sold - a.sold);
  if (sort === "newest")      result.sort((a, b) => b.id.localeCompare(a.id));

  // التصفح (pagination)
  const total     = result.length;
  const pageNum   = parseInt(page);
  const limitNum  = parseInt(limit);
  const paginated = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    products: paginated,
  });
});

// ────────────────────────────────────────────────
//  GET /api/products/featured
// ────────────────────────────────────────────────
router.get("/featured", (req, res) => {
  const featured = products.filter((p) => p.featured).map(withRating);
  res.json({ success: true, products: featured });
});

// ────────────────────────────────────────────────
//  GET /api/products/:id
// ────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "المنتج غير موجود" });

  const category = categories.find((c) => c.id === product.categoryId);
  res.json({ success: true, product: { ...withRating(product), category } });
});

// ────────────────────────────────────────────────
//  POST /api/products  (admin)
// ────────────────────────────────────────────────
router.post("/", protect, adminOnly, (req, res) => {
  const { name, brand, price, originalPrice, categoryId, description, formula, shades, image, images, stock, tags, featured } = req.body;

  if (!name || !brand || !price || !categoryId) {
    return res.status(400).json({ success: false, message: "الاسم والعلامة التجارية والسعر والتصنيف مطلوبة" });
  }

  const newProduct = {
    id: `p${uuidv4().slice(0, 8)}`,
    categoryId,
    name, brand,
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : null,
    stock: parseInt(stock) || 0,
    sold: 0,
    featured: Boolean(featured),
    image: image || "",
    images: images || [image || ""],
    description: description || "",
    formula: formula || "",
    shades: shades || ["Universal"],
    tags: tags || [],
  };

  products.push(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// ────────────────────────────────────────────────
//  PUT /api/products/:id  (admin)
// ────────────────────────────────────────────────
router.put("/:id", protect, adminOnly, (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "المنتج غير موجود" });

  products[idx] = { ...products[idx], ...req.body };
  res.json({ success: true, product: products[idx] });
});

// ────────────────────────────────────────────────
//  DELETE /api/products/:id  (admin)
// ────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "المنتج غير موجود" });

  products.splice(idx, 1);
  res.json({ success: true, message: "تم حذف المنتج" });
});

module.exports = router;
