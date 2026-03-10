const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const PORT = process.env.PORT || 5020;
const { CLIENT_URL } = require("./config");

// Models
const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");
const Review = require("./models/Review");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");
const PromoCode = require("./models/PromoCode");

const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const reviewsRoutes = require("./routes/reviews");
const wishlistRoutes = require("./routes/wishlist");
const adminRoutes = require("./routes/admin");

const app = express();

const allowedOrigins = new Set([
  CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://velour-beauty.onrender.com",
  "https://velour-beauty-store.onrender.com",
  "http://site53742-qpl6iw.scloudsite101.com/velour",
  "http://site53742-qpl6iw.scloudsite101.com",
]);

// Replace old cors code with this in backend/server.js
app.use(cors({
  origin: true, // Allows any origin to access (radical fix for Render issue)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Add this line right below cors for extra safety
app.options('*', cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

// Seed route for production
app.get("/api/seed", async (req, res) => {
  try {
    console.log("Starting database seeding...");
    
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await PromoCode.deleteMany({});
    
    console.log("Cleared existing data");

    // Create categories
    const categories = [
      { name: "Loose Powder", description: "Setting and finishing powders", icon: "powder", slug: "loose-powder" },
      { name: "Eyeshadow", description: "Eye makeup palettes and singles", icon: "eye", slug: "eyeshadow" },
      { name: "Lipstick", description: "Lip colors and lip products", icon: "lip", slug: "lipstick" },
      { name: "Foundation", description: "Base makeup and complexion products", icon: "face", slug: "foundation" },
      { name: "Blush", description: "Cheek colors and blush products", icon: "blush", slug: "blush" },
      { name: "Mascara", description: "Eyelash enhancing products", icon: "mascara", slug: "mascara" },
      { name: "Skincare", description: "Skincare and treatment products", icon: "skin", slug: "skincare" },
      { name: "Brushes", description: "Makeup brushes and tools", icon: "brush", slug: "brushes" }
    ];
    
    const createdCategories = await Category.insertMany(categories);
    console.log("Created categories:", createdCategories.length);

    // Create users
    const bcrypt = require('bcryptjs');
    const hashedUsers = [
      {
        name: "Sara Johnson",
        email: "sara@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user"
      },
      {
        name: "Admin Velour",
        email: "admin@velour.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin"
      }
    ];
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Created users:", createdUsers.length);

    // Create products with unique images and category references
    const products = [
      {
        name: "Velvet Veil Setting Powder",
        brand: "Velour Beauty",
        price: 38.00,
        originalPrice: 48.00,
        stock: 124,
        sold: 342,
        featured: true,
        category: "Loose Powder",
        categoryId: createdCategories[0]._id, // Loose Powder
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p1.jpg`,
        images: [
          `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p1.jpg`,
          `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg`
        ],
        description: "Ultra-fine translucent powder that blurs imperfections and locks makeup in place for 16 hours.",
        formula: "Silica, Nylon-12, Mica, Bismuth Oxychloride, Dimethicone, Phenoxyethanol. Fragrance-free. Talc-free.",
        shades: ["Translucent", "Ivory", "Sand", "Warm Beige", "Mocha"],
        tags: ["bestseller", "vegan"]
      },
      {
        name: "Satin Blur Finishing Powder",
        brand: "Lumière Lab",
        price: 29.00,
        stock: 85,
        sold: 198,
        featured: false,
        category: "Loose Powder",
        categoryId: createdCategories[0]._id, // Loose Powder
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg`],
        description: "Micro-milled powder that diffuses light for a soft-focus, camera-ready finish.",
        formula: "Silica, Lauroyl Lysine, Magnesium Stearate, Kaolin, Tocopheryl Acetate.",
        shades: ["Light", "Medium", "Deep"],
        tags: ["new"]
      },
      {
        name: "Airbrush Perfect HD Powder",
        brand: "Velour Beauty",
        price: 42.00,
        stock: 67,
        sold: 156,
        featured: false,
        category: "Loose Powder",
        categoryId: createdCategories[0]._id, // Loose Powder
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p3.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p3.jpg`],
        description: "Professional-grade HD powder for flawless photography and video.",
        formula: "Silica, Dimethicone, Nylon-12, Talc, Iron Oxides.",
        shades: ["Fair", "Light", "Medium", "Tan", "Deep"],
        tags: ["professional", "hd"]
      },
      {
        name: "Luminous Glow Powder",
        brand: "Aurore",
        price: 35.00,
        stock: 92,
        sold: 89,
        featured: false,
        category: "Loose Powder",
        categoryId: createdCategories[0]._id, // Loose Powder
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg`],
        description: "Radiant finishing powder with subtle luminous particles for a natural glow.",
        formula: "Mica, Silica, Nylon-12, Titanium Dioxide, Iron Oxides.",
        shades: ["Champagne", "Rose Gold", "Bronze"],
        tags: ["luminous", "glow"]
      },
      {
        name: "Matte Fix Translucent Powder",
        brand: "Velour Beauty",
        price: 32.00,
        stock: 78,
        sold: 234,
        featured: true,
        category: "Loose Powder",
        categoryId: createdCategories[0]._id, // Loose Powder
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p5.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p5.jpg`],
        description: "Oil-absorbing translucent powder that controls shine for 12 hours.",
        formula: "Silica, Corn Starch, Kaolin, Zinc Oxide.",
        shades: ["Translucent", "Deep Translucent"],
        tags: ["matte", "oil-control"]
      },
      {
        name: "Diamond Dust Setting Powder",
        brand: "Stellar Cosmetics",
        price: 45.00,
        stock: 45,
        sold: 67,
        featured: false,
        category: "Loose Powder",
        categoryId: createdCategories[0]._id, // Loose Powder
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p6.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p6.jpg`],
        description: "Luxurious setting powder with fine diamond-like particles for a radiant finish.",
        formula: "Mica, Synthetic Fluorphlogopite, Silica, Dimethicone.",
        shades: ["Crystal", "Pink Diamond", "Blue Diamond"],
        tags: ["luxury", "shimmer"]
      },
      {
        name: "Amethyst Dreams Palette",
        brand: "Velour Beauty",
        price: 52.00,
        originalPrice: 65.00,
        stock: 67,
        sold: 521,
        featured: true,
        category: "Eyeshadow",
        categoryId: createdCategories[1]._id, // Eyeshadow
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p7.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p7.jpg`],
        description: "12-pan palette ranging from soft lavenders to smoky deep plums. Mattes, satins & glitters.",
        formula: "Talc, Mica, Magnesium Stearate, Dimethicone. Paraben-free.",
        shades: ["Multi-palette"],
        tags: ["bestseller", "cruelty-free"]
      },
      {
        name: "Gilded Hour Single Shadow",
        brand: "Aurore",
        price: 18.00,
        stock: 210,
        sold: 87,
        featured: false,
        category: "Eyeshadow",
        categoryId: createdCategories[1]._id, // Eyeshadow
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg`],
        description: "Intensely pigmented mono shadow with a buttery texture. Layer or blend solo.",
        formula: "Mica, Synthetic Fluorphlogopite, Talc, Silica, Alumina.",
        shades: ["Gold Rush", "Rose Quartz", "Midnight", "Copper Dusk", "Violet Haze"],
        tags: ["vegan"]
      },
      {
        name: "Rose Gold Shimmer Topper",
        brand: "Aurore",
        price: 22.00,
        stock: 144,
        sold: 203,
        featured: false,
        category: "Eyeshadow",
        categoryId: createdCategories[1]._id, // Eyeshadow
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg`],
        description: "Blinding duochrome topper that transforms any look into something extraordinary.",
        formula: "Mica, Synthetic Fluorphlogopite, Boron Nitride, Cyclopentasiloxane.",
        shades: ["Rose Gold", "Champagne", "Holographic"],
        tags: ["new", "vegan"]
      },
      {
        name: "Plush Velvet Lip Colour",
        brand: "Velour Beauty",
        price: 26.00,
        stock: 154,
        sold: 633,
        featured: true,
        category: "Lipstick",
        categoryId: createdCategories[2]._id, // Lipstick
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg`],
        description: "Full-coverage matte that glides on like silk and stays put for 8 hours. Infused with jojoba oil.",
        formula: "Isododecane, Trimethylsiloxysilicate, Cyclopentasiloxane, Jojoba Seed Oil, Vitamin E.",
        shades: ["Berry Bliss", "Nude Ambition", "Crimson Crush", "Mauve Dream", "Terracotta Kiss"],
        tags: ["bestseller", "cruelty-free", "vegan"]
      },
      {
        name: "Glass Glow Lip Gloss",
        brand: "Lumière Lab",
        price: 21.00,
        stock: 98,
        sold: 314,
        featured: false,
        category: "Lipstick",
        categoryId: createdCategories[2]._id, // Lipstick
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg`],
        description: "High-shine, non-sticky gloss with plumping peptides for a glassy finish.",
        formula: "Polybutene, Hydrogenated Polyisobutene, Octyldodecanol, Hexylresorcinol.",
        shades: ["Crystal Clear", "Pink Haze", "Coral Pop", "Berry Sheer"],
        tags: ["new", "vegan"]
      },
      {
        name: "Silk Canvas Serum Foundation",
        brand: "Velour Beauty",
        price: 48.00,
        originalPrice: 58.00,
        stock: 72,
        sold: 289,
        featured: true,
        category: "Foundation",
        categoryId: createdCategories[3]._id, // Foundation
        image: `http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg`,
        images: [`http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg`],
        description: "Lightweight serum-foundation hybrid. Medium-to-full buildable coverage with skincare benefits.",
        formula: "Water, Cyclopentasiloxane, Niacinamide, Hyaluronic Acid, SPF 30. 42 shades.",
        shades: ["N10", "N20", "W20", "W30", "C10", "C20", "N40", "W40"],
        tags: ["bestseller", "cruelty-free"]
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log("Created products:", createdProducts.length);

    // Create sample reviews
    const reviews = [
      {
        userId: createdUsers[0]._id,
        userName: createdUsers[0].name,
        productId: createdProducts[0]._id,
        rating: 5,
        title: "Amazing powder!",
        body: "This powder is incredible. It makes my skin look flawless and lasts all day.",
        helpful: 12
      },
      {
        userId: createdUsers[0]._id,
        userName: createdUsers[0].name,
        productId: createdProducts[1]._id,
        rating: 4,
        title: "Good but not great",
        body: "Nice powder but a bit expensive for what you get.",
        helpful: 3
      }
    ];
    
    const createdReviews = await Review.insertMany(reviews);
    console.log("Created reviews:", createdReviews.length);

    // Create promo codes
    const promoCodes = [
      {
        code: "WELCOME20",
        value: 20,
        type: "percent",
        minOrder: 50
      },
      {
        code: "SUMMER15",
        value: 15,
        type: "percent",
        minOrder: 30
      }
    ];
    
    const createdPromoCodes = await PromoCode.insertMany(promoCodes);
    console.log("Created promo codes:", createdPromoCodes.length);

    console.log("✅ Database seeded successfully!");
    
    res.json({ 
      success: true, 
      message: "Database seeded successfully!",
      data: {
        categories: createdCategories.length,
        users: createdUsers.length,
        products: createdProducts.length,
        reviews: createdReviews.length,
        promoCodes: createdPromoCodes.length
      }
    });
    
  } catch (error) {
    console.error("❌ Seed error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Seed failed: " + error.message 
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
  });
};

start();
