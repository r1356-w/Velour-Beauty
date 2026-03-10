// ============================================================
// routes/products.js — Product Routes
//   GET    /api/products           — Product list with filtering and sorting
//   GET    /api/products/featured  — Featured products
//   GET    /api/products/:id       — Product details
//   POST   /api/products           — Add product (admin)
//   PUT    /api/products/:id       — Update product (admin)
//   DELETE /api/products/:id       — Delete product (admin)
// ============================================================
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const { protect, adminOnly } = require("../middleware/auth");

// ── Helper: Add average rating to each product ──────
const withRating = async (product) => {
  const productReviews = await Review.find({ productId: product._id });
  const avgRating = productReviews.length
    ? parseFloat(
        (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
      )
    : 0;
  return { ...product.toObject(), avgRating, reviewCount: productReviews.length };
};

// ────────────────────────────────────────────────
//  GET /api/products
// ────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, tag } = req.query;

    let query = {};
    
    // Filter by category
    if (category) {
      const cat = await Category.findOne({ $or: [{ slug: category }, { _id: category }] });
      if (cat) query.categoryId = cat._id;
    }
    
    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by tags
    if (tag) query.tags = tag;

    // Sorting
    let sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    if (sort === "price_desc") sortOptions.price = -1;
    if (sort === "bestseller") sortOptions.sold = -1;
    if (sort === "newest") sortOptions._id = -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    let products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Add ratings
    const productsWithRating = await Promise.all(
      products.map(async (product) => await withRating(product))
    );

    // Sort by rating if requested
    if (sort === "rating") {
      productsWithRating.sort((a, b) => b.avgRating - a.avgRating);
    }

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products: productsWithRating,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ────────────────────────────────────────────────
//  GET /api/products/featured
// ────────────────────────────────────────────────
router.get("/featured", async (req, res) => {
  try {
    let products = await Product.find({ featured: true });
    const productsWithRating = await Promise.all(
      products.map(async (product) => await withRating(product))
    );
    res.json({ success: true, products: productsWithRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ────────────────────────────────────────────────
//  GET /api/products/:id
// ────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const category = await Category.findById(product.categoryId);
    const productWithRating = await withRating(product);
    
    res.json({ success: true, product: { ...productWithRating, category } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ────────────────────────────────────────────────
//  POST /api/products  (admin)
// ────────────────────────────────────────────────
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, brand, price, originalPrice, categoryId, description, formula, shades, image, images, stock, tags, featured } = req.body;

    if (!name || !brand || !price || !categoryId) {
      return res.status(400).json({ success: false, message: "الاسم والعلامة التجارية والسعر والتصنيف مطلوبة" });
    }

    const newProduct = new Product({
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
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ────────────────────────────────────────────────
//  PUT /api/products/:id  (admin)
// ────────────────────────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "المنتج غير موجود" });

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ────────────────────────────────────────────────
//  DELETE /api/products/:id  (admin)
// ────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "المنتج غير موجود" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "تم حذف المنتج" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
