// ============================================================
// routes/reviews.js — مسارات التقييمات
//   GET    /api/reviews?productId=  — تقييمات منتج
//   POST   /api/reviews             — إضافة تقييم (محمي)
//   PUT    /api/reviews/:id/helpful — تصويت "مفيد"
//   DELETE /api/reviews/:id         — حذف تقييم
// ============================================================
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router  = express.Router();
const { reviews, products } = require("../data/store");
const { protect }           = require("../middleware/auth");

// ────────────────────────────────────────────────
//  GET /api/reviews?productId=xxx
// ────────────────────────────────────────────────
router.get("/", (req, res) => {
  const { productId } = req.query;
  const result = productId ? reviews.filter((r) => r.productId === productId) : reviews;
  res.json({ success: true, reviews: result });
});

// ────────────────────────────────────────────────
//  POST /api/reviews  (محمي)
// ────────────────────────────────────────────────
router.post("/", protect, (req, res) => {
  const { productId, rating, title, body } = req.body;

  if (!productId || !rating || !body) {
    return res.status(400).json({ success: false, message: "المنتج والتقييم والنص مطلوبة" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "التقييم يجب أن يكون بين 1 و5" });
  }

  // منع التقييم المزدوج
  const duplicate = reviews.find(
    (r) => r.productId === productId && r.userId === req.user.id
  );
  if (duplicate) {
    return res.status(409).json({ success: false, message: "قيّمت هذا المنتج من قبل" });
  }

  const newReview = {
    id: `r${uuidv4().slice(0, 8)}`,
    productId,
    userId: req.user.id,
    userName: req.user.name || req.user.email?.split("@")[0] || "User",
    rating: parseInt(rating),
    title: title || "",
    body,
    helpful: 0,
    verified: true,
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// ────────────────────────────────────────────────
//  PUT /api/reviews/:id/helpful  (محمي)
// ────────────────────────────────────────────────
router.put("/:id/helpful", protect, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "التقييم غير موجود" });

  review.helpful += 1;
  res.json({ success: true, helpful: review.helpful });
});

// ────────────────────────────────────────────────
//  DELETE /api/reviews/:id  (صاحب التقييم أو admin)
// ────────────────────────────────────────────────
router.delete("/:id", protect, (req, res) => {
  const idx = reviews.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "التقييم غير موجود" });

  if (reviews[idx].userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "لا يمكنك حذف تقييم شخص آخر" });
  }

  reviews.splice(idx, 1);
  res.json({ success: true, message: "تم حذف التقييم" });
});

module.exports = router;
