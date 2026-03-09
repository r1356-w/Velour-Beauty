const express = require('express');
const router = express.Router();
const { products, reviews, orders } = require('../data/store');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

const buildUserLookup = (mongoUsers) => {
  const map = new Map();
  for (const u of mongoUsers) {
    map.set(String(u._id), u.name);
  }
  return map;
};

router.get('/dashboard', async (req, res) => {
  try {
    const mongoUsers = await User.find({}).select('name role').lean();
    const userNameById = buildUserLookup(mongoUsers);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        ...order,
        userName: order.userName || userNameById.get(String(order.userId)) || 'Unknown',
      }));

    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const topProducts = [...products]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name, sold: p.sold, price: p.price }));

    const totalUsers = mongoUsers.filter((u) => u.role === 'user').length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalReviews: reviews.length,
      },
      statusBreakdown,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
    const normalized = users.map((u) => ({ ...u, id: String(u._id) }));
    res.json({ success: true, users: normalized });
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, name } = req.body;
    const update = {};
    if (role) update.role = role;
    if (name) update.name = name;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: { ...user, id: String(user._id) } });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/reviews', (req, res) => {
  const enriched = reviews.map((review) => {
    const product = products.find((p) => p.id === review.productId);
    return { ...review, productName: product?.name || 'Unknown' };
  });
  res.json({ success: true, reviews: enriched });
});

router.delete('/reviews/:id', (req, res) => {
  const idx = reviews.findIndex((review) => review.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  reviews.splice(idx, 1);
  res.json({ success: true, message: 'Review deleted' });
});

router.get('/orders', async (req, res) => {
  try {
    const mongoUsers = await User.find({}).select('name').lean();
    const userNameById = buildUserLookup(mongoUsers);

    const enriched = orders.map((order) => ({
      ...order,
      userName: order.userName || userNameById.get(String(order.userId)) || 'Unknown',
    }));

    res.json({ success: true, orders: enriched });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
