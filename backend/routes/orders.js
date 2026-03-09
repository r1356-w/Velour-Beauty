// ============================================================
// routes/orders.js — مسارات الطلبات
//   GET  /api/orders           — طلبات المستخدم الحالي
//   GET  /api/orders/:id       — تفاصيل طلب واحد
//   POST /api/orders           — إتمام الشراء (Checkout)
//   PUT  /api/orders/:id/status— تحديث حالة الطلب (admin)
// ============================================================
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const { orders, carts, products, promoCodes } = require("../data/store");
const { protect, adminOnly }                  = require("../middleware/auth");

// ────────────────────────────────────────────────
//  GET /api/orders — طلبات المستخدم الحالي
// ────────────────────────────────────────────────
router.get("/", protect, (req, res) => {
  const userOrders = orders.filter((o) => o.userId === req.user.id);
  res.json({ success: true, orders: userOrders });
});

// ────────────────────────────────────────────────
//  GET /api/orders/:id — تفاصيل طلب
// ────────────────────────────────────────────────
router.get("/:id", protect, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "الطلب غير موجود" });

  if (order.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "غير مصرح بالوصول" });
  }

  res.json({ success: true, order });
});

// ────────────────────────────────────────────────
//  POST /api/orders — إتمام الشراء
// ────────────────────────────────────────────────
router.post("/", protect, (req, res) => {
  const { shippingAddress, paymentMethod, promoCode } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "عنوان الشحن وطريقة الدفع مطلوبان",
    });
  }

  const cartItems = carts[req.user.id] || [];
  if (!cartItems.length) {
    return res.status(400).json({ success: false, message: "سلة التسوق فارغة" });
  }

  // بناء عناصر الطلب بالأسعار الحالية
  const items = cartItems.map((ci) => {
    const p = products.find((prod) => prod.id === ci.productId);
    return {
      productId: ci.productId,
      name: p?.name || "منتج غير معروف",
      shade: ci.shade,
      qty: ci.qty,
      price: p?.price || 0,
    };
  });

  let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  // تطبيق كود الخصم
  let discount = 0;
  if (promoCode) {
    const promo = promoCodes.find((p) => p.code === promoCode.toUpperCase());
    if (promo && subtotal >= promo.minOrder) {
      discount =
        promo.type === "percent" ? subtotal * promo.value : promo.value;
    }
  }

  // حساب الشحن والضريبة
  const shipping = subtotal > 75 ? 0 : 5.99;
  const tax      = parseFloat(((subtotal - discount) * 0.08).toFixed(2));
  const total    = parseFloat((subtotal - discount + shipping + tax).toFixed(2));

  const now = new Date().toISOString();

  const newOrder = {
    id: `ord${uuidv4().slice(0, 8)}`,
    userId: req.user.id,
    userName: req.user.name || req.user.email?.split("@")[0] || "User",
    items,
    subtotal:  parseFloat(subtotal.toFixed(2)),
    discount:  parseFloat(discount.toFixed(2)),
    shipping,
    tax,
    total,
    status: "placed",
    trackingNumber: `VB${Math.random().toString().slice(2, 12)}`,
    shippingAddress,
    paymentMethod,
    promoCode: promoCode || null,
    createdAt: now,
    updatedAt: now,
    timeline: [
      { status: "placed", label: "تم تقديم الطلب", date: now },
    ],
  };

  orders.push(newOrder);
  // تفريغ السلة بعد الطلب الناجح
  carts[req.user.id] = [];

  res.status(201).json({ success: true, order: newOrder });
});

// ────────────────────────────────────────────────
//  PUT /api/orders/:id/status  (admin)
// ────────────────────────────────────────────────
router.put("/:id/status", protect, adminOnly, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "الطلب غير موجود" });

  const { status, label } = req.body;
  order.status    = status;
  order.updatedAt = new Date().toISOString();
  order.timeline.push({
    status,
    label: label || status,
    date: new Date().toISOString(),
  });

  res.json({ success: true, order });
});

module.exports = router;
