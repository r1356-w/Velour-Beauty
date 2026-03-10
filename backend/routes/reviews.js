// ============================================================
// routes/reviews.js — Review Routes
//   GET    /api/reviews?productId=  — Product reviews
//   POST   /api/reviews             — Add review (protected)
//   PUT    /api/reviews/:id/helpful — "Helpful" vote
//   DELETE /api/reviews/:id         — Delete review
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
//  POST /api/reviews  (protected)
// ────────────────────────────────────────────────
router.post("/", protect, (req, res) => {
  const { productId, rating, title, body } = req.body;

  if (!productId || !rating || !body) {
    return res.status(400).json({ success: false, message: "Product, rating and body are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
  }

  // Prevent duplicate reviews
  const duplicate = reviews.find(
    (r) => r.productId === productId && r.userId === req.user.id
  );
  if (duplicate) {
    return res.status(409).json({ success: false, message: "You have already reviewed this product" });
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
//  PUT /api/reviews/:id/helpful  (protected)
// ────────────────────────────────────────────────
router.put("/:id/helpful", protect, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });

  review.helpful += 1;
  res.json({ success: true, helpful: review.helpful });
});

// ────────────────────────────────────────────────
//  DELETE /api/reviews/:id  (review owner or admin)
// ────────────────────────────────────────────────
router.delete("/:id", protect, (req, res) => {
  const idx = reviews.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Review not found" });

  if (reviews[idx].userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "You cannot delete another user's review" });
  }

  reviews.splice(idx, 1);
  res.json({ success: true, message: "Review deleted" });
});

module.exports = router;
