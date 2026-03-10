const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const PromoCode = require('../models/PromoCode');
const connectDB = require('../config/database');

const sampleData = {
  categories: [
    { name: "Loose Powder", description: "Setting and finishing powders" },
    { name: "Eyeshadow", description: "Eye makeup palettes and singles" },
    { name: "Lipstick", description: "Lip colors and lip products" },
    { name: "Foundation", description: "Base makeup and complexion products" },
    { name: "Blush", description: "Cheek colors and blush products" },
    { name: "Mascara", description: "Eyelash enhancing products" },
    { name: "Skincare", description: "Skincare and treatment products" },
    { name: "Brushes", description: "Makeup brushes and tools" }
  ],
  
  users: [
    {
      name: "Sara Johnson",
      email: "sara@example.com",
      password: "user123",
      role: "user"
    },
    {
      name: "Admin Velour",
      email: "admin@velour.com",
      password: "admin123",
      role: "admin"
    }
  ],

  products: [
    // Loose Powder Products (6 products)
    {
      name: "Velvet Veil Setting Powder",
      brand: "Velour Beauty",
      price: 38.00,
      originalPrice: 48.00,
      stock: 124,
      sold: 342,
      featured: true,
      category: "Loose Powder",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p1.jpg",
      images: [
        "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p1.jpg",
        "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg"
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
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg"],
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
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p3.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p3.jpg"],
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
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg"],
      description: "Illuminating powder with subtle shimmer for a radiant finish.",
      formula: "Mica, Silica, Titanium Dioxide, Bismuth Oxychloride.",
      shades: ["Champagne", "Rose Gold", "Bronze"],
      tags: ["shimmer", "illuminating"]
    },
    {
      name: "Matte Control Powder",
      brand: "Velour Beauty",
      price: 31.00,
      stock: 78,
      sold: 234,
      featured: false,
      category: "Loose Powder",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p5.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p5.jpg"],
      description: "Oil-absorbing powder for long-lasting matte finish.",
      formula: "Kaolin, Corn Starch, Silica, Zinc Stearate.",
      shades: ["Translucent", "Peach", "Warm"],
      tags: ["oil-control", "matte"]
    },
    {
      name: "Crystal Clear Setting Powder",
      brand: "Lumière Lab",
      price: 26.00,
      stock: 145,
      sold: 67,
      featured: false,
      category: "Loose Powder",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p6.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p6.jpg"],
      description: "Weightless setting powder that disappears on application.",
      formula: "Silica, Squalane, Vitamin E, Fragrance-free.",
      shades: ["Clear", "Sheer"],
      tags: ["weightless", "clear"]
    },

    // Eyeshadow Products (7 products)
    {
      name: "Amethyst Dreams Palette",
      brand: "Velour Beauty",
      price: 52.00,
      originalPrice: 65.00,
      stock: 67,
      sold: 521,
      featured: true,
      category: "Eyeshadow",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p7.jpg",
      images: [
        "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p7.jpg",
        "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg",
        "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg"
      ],
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
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg"],
      description: "Intensely pigmented mono shadow with a buttery texture. Layer or blend solo.",
      formula: "Mica, Synthetic Fluorphlogopite, Talc, Silica, Alumina.",
      shades: ["Gold Rush", "Rose Quartz", "Midnight", "Copper Dusk", "Violet Haze"],
      tags: ["vegan"]
    },
    {
      name: "Sunset Boulevard Palette",
      brand: "Velour Beauty",
      price: 48.00,
      stock: 89,
      sold: 445,
      featured: false,
      category: "Eyeshadow",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg"],
      description: "Warm-toned palette with sunset-inspired shades from golden hour to twilight.",
      formula: "Talc, Mica, Kaolin, Dimethicone, Vitamin E.",
      shades: ["Multi-palette"],
      tags: ["warm-tones", "sunset"]
    },
    {
      name: "Midnight Magic Palette",
      brand: "Lumière Lab",
      price: 45.00,
      stock: 134,
      sold: 278,
      featured: false,
      category: "Eyeshadow",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Deep, mysterious palette perfect for smoky eyes and dramatic looks.",
      formula: "Mica, Iron Oxides, Ultramarines, Carnauba Wax.",
      shades: ["Multi-palette"],
      tags: ["smoky", "dramatic"]
    },
    {
      name: "Cosmic Glitter Palette",
      brand: "Aurore",
      price: 38.00,
      stock: 156,
      sold: 189,
      featured: false,
      category: "Eyeshadow",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "High-impact glitter palette with cosmic-inspired shades.",
      formula: "Polyethylene Terephthalate, Mica, Synthetic Fluorphlogopite.",
      shades: ["Multi-palette"],
      tags: ["glitter", "cosmic"]
    },
    {
      name: "Nude Obsession Palette",
      brand: "Velour Beauty",
      price: 42.00,
      stock: 198,
      sold: 367,
      featured: false,
      category: "Eyeshadow",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Everyday nude palette with versatile neutral shades.",
      formula: "Talc, Mica, Kaolin, Corn Starch.",
      shades: ["Multi-palette"],
      tags: ["nude", "everyday"]
    },
    {
      name: "Electric Dreams Palette",
      brand: "Lumière Lab",
      price: 40.00,
      stock: 87,
      sold: 234,
      featured: false,
      category: "Eyeshadow",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Vibrant electric palette for bold, creative looks.",
      formula: "Mica, Titanium Dioxide, Ultramarines, Chromium Oxides.",
      shades: ["Multi-palette"],
      tags: ["vibrant", "bold"]
    },

    // Lipstick Products (6 products)
    {
      name: "Plush Velvet Lip Colour",
      brand: "Velour Beauty",
      price: 26.00,
      stock: 154,
      sold: 633,
      featured: true,
      category: "Lipstick",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
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
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "High-shine, non-sticky gloss with plumping peptides for a glassy finish.",
      formula: "Polybutene, Hydrogenated Polyisobutene, Octyldodecanol, Hexylresorcinol.",
      shades: ["Crystal Clear", "Pink Haze", "Coral Pop", "Berry Sheer"],
      tags: ["new", "vegan"]
    },
    {
      name: "Satin Kiss Lipstick",
      brand: "Aurore",
      price: 24.00,
      stock: 187,
      sold: 256,
      featured: false,
      category: "Lipstick",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Creamy satin finish lipstick with comfortable wear.",
      formula: "Beeswax, Carnauba Wax, Candelilla Wax, Castor Oil, Vitamin E.",
      shades: ["Rose", "Nude", "Berry", "Coral"],
      tags: ["satin", "creamy"]
    },
    {
      name: "Velvet Rouge Lipstick",
      brand: "Velour Beauty",
      price: 28.00,
      stock: 134,
      sold: 423,
      featured: false,
      category: "Lipstick",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Rich velvet matte lipstick with intense pigmentation.",
      formula: "Candelilla Wax, Shea Butter, Vitamin E, Iron Oxides.",
      shades: ["Ruby Red", "Deep Plum", "Nude Pink", "Terracotta"],
      tags: ["matte", "velvet"]
    },
    {
      name: "Glossy Kiss Lip Tint",
      brand: "Lumière Lab",
      price: 19.00,
      stock: 201,
      sold: 178,
      featured: false,
      category: "Lipstick",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Lightweight lip tint with natural glossy finish.",
      formula: "Water, Glycerin, Fruit Extracts, Natural Flavors.",
      shades: ["Cherry", "Peach", "Berry", "Rose"],
      tags: ["tint", "natural"]
    },
    {
      name: "Hydra Plump Lip Balm",
      brand: "Aurore",
      price: 16.00,
      stock: 267,
      sold: 145,
      featured: false,
      category: "Lipstick",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Hydrating lip balm with plumping effect.",
      formula: "Shea Butter, Coconut Oil, Peppermint Oil, Vitamin E.",
      shades: ["Clear", "Tinted Pink", "Berry"],
      tags: ["hydrating", "plumping"]
    },

    // Foundation Products (6 products)
    {
      name: "Silk Canvas Serum Foundation",
      brand: "Velour Beauty",
      price: 48.00,
      originalPrice: 58.00,
      stock: 72,
      sold: 289,
      featured: true,
      category: "Foundation",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Lightweight serum-foundation hybrid. Medium-to-full buildable coverage with skincare benefits.",
      formula: "Water, Cyclopentasiloxane, Niacinamide, Hyaluronic Acid, SPF 30. 42 shades.",
      shades: ["N10", "N20", "W20", "W30", "C10", "C20", "N40", "W40"],
      tags: ["bestseller", "cruelty-free"]
    },
    {
      name: "Matte Perfection Foundation",
      brand: "Lumière Lab",
      price: 35.00,
      stock: 145,
      sold: 234,
      featured: false,
      category: "Foundation",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Long-wearing matte foundation with full coverage.",
      formula: "Water, Dimethicone, Glycerin, Iron Oxides, Titanium Dioxide.",
      shades: ["Fair", "Light", "Medium", "Tan", "Deep"],
      tags: ["matte", "full-coverage"]
    },
    {
      name: "Dewy Glow Foundation",
      brand: "Aurore",
      price: 42.00,
      stock: 98,
      sold: 312,
      featured: false,
      category: "Foundation",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Radiant dewy finish foundation with luminous glow.",
      formula: "Water, Glycerin, Hyaluronic Acid, Mica, Vitamin C.",
      shades: ["Fair", "Light", "Medium", "Tan"],
      tags: ["dewy", "radiant"]
    },
    {
      name: "HD Perfect Canvas Foundation",
      brand: "Velour Beauty",
      price: 45.00,
      stock: 67,
      sold: 189,
      featured: false,
      category: "Foundation",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Professional HD foundation for photography and video.",
      formula: "Water, Dimethicone, Silica, Iron Oxides, SPF 15.",
      shades: ["Porcelain", "Ivory", "Beige", "Honey", "Caramel"],
      tags: ["hd", "professional"]
    },
    {
      name: "Lightweight Tinted Moisturizer",
      brand: "Lumière Lab",
      price: 32.00,
      stock: 189,
      sold: 267,
      featured: false,
      category: "Foundation",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Sheer tinted moisturizer with SPF 30 and skincare benefits.",
      formula: "Water, Glycerin, Niacinamide, Zinc Oxide, Vitamin E.",
      shades: ["Light", "Medium", "Deep"],
      tags: ["tinted", "moisturizer"]
    },
    {
      name: "Full Coverage Concealer Foundation",
      brand: "Aurore",
      price: 38.00,
      stock: 123,
      sold: 198,
      featured: false,
      category: "Foundation",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "High-coverage foundation that conceals imperfections.",
      formula: "Water, Cyclopentasiloxane, Beeswax, Iron Oxides.",
      shades: ["Fair", "Light", "Medium", "Tan", "Deep"],
      tags: ["full-coverage", "concealer"]
    },

    // Blush Products (5 products)
    {
      name: "Petal Flush Blush Duo",
      brand: "Aurore",
      price: 32.00,
      stock: 115,
      sold: 178,
      featured: false,
      category: "Blush",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Finely milled powder blush duo with a matte shade and a pearl-infused highlight.",
      formula: "Talc, Mica, Kaolin, Zinc Stearate, Tocopheryl Acetate. Paraben-free.",
      shades: ["Peach & Champagne", "Rose & Gold", "Berry & Silver"],
      tags: ["vegan"]
    },
    {
      name: "Coral Glow Cream Blush",
      brand: "Velour Beauty",
      price: 28.00,
      stock: 134,
      sold: 234,
      featured: false,
      category: "Blush",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Cream blush that melts into skin for natural flush.",
      formula: "Water, Glycerin, Iron Oxides, Vitamin E.",
      shades: ["Coral", "Peach", "Rose"],
      tags: ["cream", "natural"]
    },
    {
      name: "Rose Gold Shimmer Topper",
      brand: "Aurore",
      price: 22.00,
      stock: 144,
      sold: 203,
      featured: false,
      category: "Blush",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg"],
      description: "Blinding duochrome topper that transforms any look into something extraordinary.",
      formula: "Mica, Synthetic Fluorphlogopite, Boron Nitride, Cyclopentasiloxane.",
      shades: ["Rose Gold", "Champagne", "Holographic"],
      tags: ["new", "vegan"]
    },
    {
      name: "Berry Kiss Powder Blush",
      brand: "Lumière Lab",
      price: 26.00,
      stock: 167,
      sold: 189,
      featured: false,
      category: "Blush",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Soft powder blush with berry-inspired shades.",
      formula: "Talc, Mica, Kaolin, Carnauba Wax.",
      shades: ["Berry", "Raspberry", "Strawberry"],
      tags: ["powder", "berry"]
    },
    {
      name: "Peach Dream Cream Blush",
      brand: "Velour Beauty",
      price: 24.00,
      stock: 198,
      sold: 156,
      featured: false,
      category: "Blush",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Creamy peach blush for healthy, natural glow.",
      formula: "Water, Shea Butter, Iron Oxides, Vitamin C.",
      shades: ["Peach", "Coral", "Nude"],
      tags: ["cream", "peach"]
    },

    // Mascara Products (5 products)
    {
      name: "Noir Lash Amplifier Mascara",
      brand: "Velour Beauty",
      price: 28.00,
      stock: 203,
      sold: 741,
      featured: true,
      category: "Mascara",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg"],
      description: "Buildable, clump-free formula with a curved brush. Adds volume, length & curl — smudge-proof.",
      formula: "Water, Beeswax, Carnauba Wax, Stearic Acid, Iron Oxides. Ophthalmologist tested.",
      shades: ["Noir Black", "Deep Brown"],
      tags: ["bestseller"]
    },
    {
      name: "Volume Boost Mascara",
      brand: "Lumière Lab",
      price: 24.00,
      stock: 156,
      sold: 345,
      featured: false,
      category: "Mascara",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg"],
      description: "Dramatic volume mascara with fiber-enhanced formula.",
      formula: "Water, Beeswax, Nylon Fibers, Iron Oxides.",
      shades: ["Black", "Brown"],
      tags: ["volume", "fiber"]
    },
    {
      name: "Lengthening Lash Mascara",
      brand: "Aurore",
      price: 26.00,
      stock: 189,
      sold: 267,
      featured: false,
      category: "Mascara",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Lengthening mascara for longer, defined lashes.",
      formula: "Water, Carnauba Wax, Panthenol, Iron Oxides.",
      shades: ["Black", "Brown", "Navy"],
      tags: ["lengthening", "defining"]
    },
    {
      name: "Waterproof Lash Mascara",
      brand: "Velour Beauty",
      price: 30.00,
      stock: 134,
      sold: 198,
      featured: false,
      category: "Mascara",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Long-lasting waterproof mascara for all-day wear.",
      formula: "Water, Beeswax, Synthetic Wax, Iron Oxides.",
      shades: ["Black", "Brown"],
      tags: ["waterproof", "long-lasting"]
    },
    {
      name: "Natural Lash Mascara",
      brand: "Lumière Lab",
      price: 22.00,
      stock: 201,
      sold: 123,
      featured: false,
      category: "Mascara",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Natural-looking mascara for subtle enhancement.",
      formula: "Water, Plant Waxes, Iron Oxides, Vitamin E.",
      shades: ["Black", "Brown", "Clear"],
      tags: ["natural", "subtle"]
    },

    // Skincare Products (8 products)
    {
      name: "Dewy Prep Moisturising Primer",
      brand: "Velour Beauty",
      price: 34.00,
      stock: 88,
      sold: 456,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Hydrating primer that smooths and plumps skin while extending foundation wear.",
      formula: "Water, Glycerin, Dimethicone, Squalane, Centella Asiatica, Sodium Hyaluronate.",
      shades: ["Universal"],
      tags: ["vegan", "cruelty-free"]
    },
    {
      name: "Barrier Shield SPF 50 Sunscreen",
      brand: "Lumière Lab",
      price: 42.00,
      originalPrice: 55.00,
      stock: 63,
      sold: 312,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg"],
      description: "Invisible SPF 50 PA++++ sunscreen that doubles as a makeup primer. No white cast.",
      formula: "Zinc Oxide, Titanium Dioxide, Niacinamide, Centella Asiatica, Tocopherol.",
      shades: ["Universal"],
      tags: ["vegan", "cruelty-free"]
    },
    {
      name: "Hydra Glow Serum",
      brand: "Aurore",
      price: 45.00,
      stock: 145,
      sold: 234,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Hydrating serum with vitamin C and hyaluronic acid.",
      formula: "Water, Vitamin C, Hyaluronic Acid, Glycerin, Ferulic Acid.",
      shades: ["Universal"],
      tags: ["serum", "hydrating"]
    },
    {
      name: "Overnight Repair Cream",
      brand: "Velour Beauty",
      price: 52.00,
      stock: 89,
      sold: 167,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Rich night cream for overnight skin repair and renewal.",
      formula: "Water, Shea Butter, Retinol, Peptides, Vitamin E.",
      shades: ["Universal"],
      tags: ["night", "repair"]
    },
    {
      name: "Gentle Cleansing Balm",
      brand: "Lumière Lab",
      price: 28.00,
      stock: 167,
      sold: 289,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Melting cleansing balm that removes makeup and impurities.",
      formula: "Safflower Oil, Jojoba Oil, Vitamin E, Essential Oils.",
      shades: ["Universal"],
      tags: ["cleanser", "balm"]
    },
    {
      name: "Brightening Eye Cream",
      brand: "Aurore",
      price: 38.00,
      stock: 134,
      sold: 198,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Brightening eye cream for dark circles and puffiness.",
      formula: "Water, Vitamin C, Caffeine, Peptides, Niacinamide.",
      shades: ["Universal"],
      tags: ["eye-cream", "brightening"]
    },
    {
      name: "Moisture Lock Moisturizer",
      brand: "Velour Beauty",
      price: 35.00,
      stock: 201,
      sold: 345,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "24-hour moisture-locking moisturizer for all skin types.",
      formula: "Water, Hyaluronic Acid, Ceramides, Squalane, Vitamin E.",
      shades: ["Universal"],
      tags: ["moisturizer", "hydrating"]
    },
    {
      name: "Exfoliating Toner",
      brand: "Lumière Lab",
      price: 24.00,
      stock: 189,
      sold: 234,
      featured: false,
      category: "Skincare",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg"],
      description: "Gentle exfoliating toner with glycolic acid.",
      formula: "Water, Glycolic Acid, Witch Hazel, Aloe Vera, Vitamin B5.",
      shades: ["Universal"],
      tags: ["toner", "exfoliating"]
    },

    // Brushes Products (7 products)
    {
      name: "Professional Foundation Brush",
      brand: "Velour Beauty",
      price: 32.00,
      stock: 156,
      sold: 234,
      featured: false,
      category: "Brushes",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Professional-grade foundation brush for flawless application.",
      formula: "Synthetic fibers, wooden handle, vegan-friendly.",
      shades: ["Universal"],
      tags: ["foundation", "professional"]
    },
    {
      name: "Precision Eyeshadow Brush Set",
      brand: "Aurore",
      price: 45.00,
      stock: 89,
      sold: 167,
      featured: false,
      category: "Brushes",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
      description: "Set of 5 precision eyeshadow brushes for detailed application.",
      formula: "Natural hair, aluminum ferrules, wooden handles.",
      shades: ["Universal"],
      tags: ["eyeshadow", "precision"]
    },
    {
      name: "Flawless Powder Brush",
      brand: "Lumière Lab",
      price: 28.00,
      stock: 234,
      sold: 189,
      featured: false,
      category: "Brushes",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
      description: "Luxurious powder brush for even powder application.",
      formula: "Soft synthetic fibers, ergonomic handle.",
      shades: ["Universal"],
      tags: ["powder", "soft"]
    },
    {
      name: "Blush Contour Brush",
      brand: "Velour Beauty",
      price: 26.00,
      stock: 178,
      sold: 145,
      featured: false,
      category: "Brushes",
      image: "https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
      images: ["https://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
      description: "Angled brush for perfect blush and contour application.",
      formula: "Synthetic fibers, angled design, vegan-friendly.",
      shades: ["Universal"],
      tags: ["blush", "contour"]
    }
  ],

  reviews: [
    {
      title: "Holy grail powder!",
      body: "Stays matte all day and never looks cakey. Worth every penny.",
      rating: 5,
      helpful: 24
    },
    {
      title: "Great but pricey",
      body: "Beautiful finish and long-lasting. Knocked off one star for price point.",
      rating: 4,
      helpful: 11
    },
    {
      title: "Stunning palette",
      body: "The pigmentation is incredible. The glitter shades are blinding. Perfect for day to night looks.",
      rating: 5,
      helpful: 38
    },
    {
      title: "Best matte lipstick ever",
      body: "Doesn't dry out my lips! Finally a matte that stays comfortable. The Berry Bliss shade is perfect.",
      rating: 5,
      helpful: 52
    },
    {
      title: "My new foundation!",
      body: "Lightweight but buildable. The niacinamide has noticeably improved my skin texture over time.",
      rating: 5,
      helpful: 29
    },
    {
      title: "No more clumps!",
      body: "Finally a mascara that gives volume without clumping. I'm completely obsessed with this formula.",
      rating: 5,
      helpful: 41
    }
  ],
  
  promoCodes: [
    { code: "VELOUR20", type: "percent", value: 0.20, minOrder: 50 },
    { code: "WELCOME10", type: "flat", value: 10, minOrder: 0 }
  ]
};


const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildProductImages = (product) => {
  const productSlug = slugify(product.name);
  const primaryText = encodeURIComponent(`${product.category} | ${product.name}`);
  const detailText = encodeURIComponent(`${product.brand} | ${product.name} Detail`);
  const packText = encodeURIComponent(`${product.name} | Packaging`);

  const image = `https://placehold.co/800x800/png?text=${primaryText}&id=${productSlug}-main`;
  const detail = `https://placehold.co/800x800/png?text=${detailText}&id=${productSlug}-detail`;
  const packaging = `https://placehold.co/800x800/png?text=${packText}&id=${productSlug}-pack`;

  return { image, images: [image, detail, packaging] };
};

const preparedProducts = sampleData.products.map((product) => ({
  ...product,
  ...buildProductImages(product)
}));

const productNameSet = new Set();
const productImageSet = new Set();

for (const product of preparedProducts) {
  if (productNameSet.has(product.name)) {
    throw new Error(`Duplicate product name detected in seed data: ${product.name}`);
  }
  productNameSet.add(product.name);

  if (productImageSet.has(product.image)) {
    throw new Error(`Duplicate product image detected in seed data: ${product.image}`);
  }
  productImageSet.add(product.image);
}

const seedDatabase = async () => {
  try {
    // Clear existing data completely
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await PromoCode.deleteMany({});

    console.log('🗑️ Cleared all existing data');

    // Create categories
    const categoryIconMap = {
      'Loose Powder': '?',
      'Eyeshadow': '???',
      'Lipstick': '??',
      'Foundation': '??',
      'Blush': '??',
      'Mascara': '???',
      'Skincare': '??',
      'Brushes': '??'
    };

    const categoriesToInsert = sampleData.categories.map((category) => ({
      ...category,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      icon: categoryIconMap[category.name] || '?'
    }));

    const categories = await Category.insertMany(categoriesToInsert);
    console.log('✅ Categories created');

    // Create users with hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      sampleData.users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    const users = await User.insertMany(usersWithHashedPasswords);
    console.log('✅ Users created');

    // Create products with category references
    const products = await Promise.all(
      preparedProducts.map(async (product) => {
        const category = categories.find(cat => cat.name === product.category);
        return {
          ...product,
          categoryId: category._id
        };
      })
    );

    const createdProducts = await Product.insertMany(products);
    console.log('✅ Products created');
    // Create reviews
    const reviewDocs = sampleData.reviews.map((review, index) => ({
      ...review,
      productId: createdProducts[index % createdProducts.length]._id,
      userId: users[0]._id,
      userName: users[0].name,
      verified: true,
      createdAt: new Date()
    }));

    await Review.insertMany(reviewDocs);
    console.log('? Reviews created');

    // Create promo codes
    await PromoCode.insertMany(sampleData.promoCodes);
    console.log('✅ Promo codes created');

    // Create sample order
    const sampleOrder = {
      userId: users[0]._id,
      items: [
        {
          productId: createdProducts[0]._id,
          name: createdProducts[0].name,
          qty: 2,
          price: createdProducts[0].price
        }
      ],
      subtotal: createdProducts[0].price * 2,
      discount: 0,
      shipping: 5.99,
      tax: 3.8,
      total: createdProducts[0].price * 2 + 5.99 + 3.8,
      status: 'delivered',
      trackingNumber: 'VBSEED0001',
      shippingAddress: {
        name: users[0].name,
        street: '123 Beauty Street',
        city: 'Cosmetic City',
        state: 'Glamour',
        zip: '12345',
        country: 'Makeup Land'
      },
      paymentMethod: 'credit_card',
      createdAt: new Date(),
      timeline: [
        { status: 'placed', label: 'Order Placed', date: new Date() },
        { status: 'delivered', label: 'Delivered', date: new Date() }
      ]
    };

    await Order.create(sampleOrder);
    console.log('✅ Sample order created');

    // Create sample cart
    const sampleCart = {
      userId: users[0]._id,
      items: [
        {
          productId: createdProducts[1]._id,
          qty: 1,
          shade: createdProducts[1].shades?.[0] || 'Universal'
        }
      ]
    };

    await Cart.create(sampleCart);
    console.log('✅ Cart created');

    // Create sample wishlist
    const sampleWishlist = {
      userId: users[0]._id,
      products: [createdProducts[2]._id]
    };

    await Wishlist.create(sampleWishlist);
    console.log('✅ Wishlist created');

    console.log(`Seed complete: ${preparedProducts.length} unique products with validated unique image URLs.`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;


if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await mongoose.disconnect();
      console.log('Seed script finished successfully.');
      process.exit(0);
    } catch (error) {
      console.error('Seed script failed:', error);
      try {
        await mongoose.disconnect();
      } catch (_) {}
      process.exit(1);
    }
  })();
}
