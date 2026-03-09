// ============================================================
// Vercel Serverless Functions - Velour Beauty API
// ============================================================

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('../backend/routes/auth');
const productRoutes = require('../backend/routes/products');
const categoryRoutes = require('../backend/routes/categories');
const reviewRoutes = require('../backend/routes/reviews');
const cartRoutes = require('../backend/routes/cart');
const orderRoutes = require('../backend/routes/orders');
const wishlistRoutes = require('../backend/routes/wishlist');
const adminRoutes = require('../backend/routes/admin');

// Import models
const User = require('../backend/models/User');
const Product = require('../backend/models/Product');
const Category = require('../backend/models/Category');
const Review = require('../backend/models/Review');
const Order = require('../backend/models/Order');
const Cart = require('../backend/models/Cart');
const Wishlist = require('../backend/models/Wishlist');
const PromoCode = require('../backend/models/PromoCode');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Seed route for production
app.get('/api/seed', async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Import seed data
    const { seedDatabase } = require('../backend/seed/seedDatabase');
    
    // Run seed
    await seedDatabase();
    
    res.json({ 
      success: true, 
      message: 'Database seeded successfully!' 
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Seed failed' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Export for Vercel
module.exports = app;
