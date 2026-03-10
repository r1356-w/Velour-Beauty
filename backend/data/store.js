// ============================================================
// data/store.js — In-memory database
// In production: replace with MongoDB or PostgreSQL
// ============================================================

const users = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@velour.com",
    // Password: admin123
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7y",
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "u2",
    name: "Sara Johnson",
    email: "sara@example.com",
    // Password: user123
    password: "$2a$10$TwXmN3p5t8kLqVrWs1uOEuZ6yVjXF9PkQ8mRnDHsGaA4cJBiV5.Oy",
    role: "user",
    createdAt: "2024-02-15T00:00:00.000Z",
  },
];

const categories = [
  { id: "c1", name: "Loose Powder",   slug: "loose-powder",  icon: "✨", description: "Silky setting & finishing powders" },
  { id: "c2", name: "Eyeshadow",      slug: "eyeshadow",     icon: "👁️", description: "Singles, palettes & shimmer duos" },
  { id: "c3", name: "Lipstick",       slug: "lipstick",      icon: "💄", description: "Mattes, satins & glossy finishes" },
  { id: "c4", name: "Foundation",     slug: "foundation",    icon: "🌸", description: "Buildable, breathable coverage" },
  { id: "c5", name: "Blush & Bronzer",slug: "blush-bronzer", icon: "🌺", description: "Sculpt, contour & glow" },
  { id: "c6", name: "Mascara",        slug: "mascara",       icon: "🖌️", description: "Lengthening & volumizing formulas" },
  { id: "c7", name: "Skincare",       slug: "skincare",      icon: "🫧", description: "Prep & protect your canvas" },
  { id: "c8", name: "Brushes & Tools",slug: "brushes-tools", icon: "🪄", description: "Pro-grade application tools" },
];

const products = [
  {
    id: "p1", categoryId: "c1",
    name: "Velvet Veil Setting Powder", brand: "Velour Beauty",
    price: 38.00, originalPrice: 48.00, stock: 124, sold: 342, featured: true,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p1.jpg",
    images: [
      "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p1.jpg",
      "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg"
    ],
    description: "Ultra-fine translucent powder that blurs imperfections and locks makeup in place for 16 hours.",
    formula: "Silica, Nylon-12, Mica, Bismuth Oxychloride, Dimethicone, Phenoxyethanol. Fragrance-free. Talc-free.",
    shades: ["Translucent", "Ivory", "Sand", "Warm Beige", "Mocha"],
    tags: ["bestseller", "vegan"],
  },
  {
    id: "p2", categoryId: "c1",
    name: "Satin Blur Finishing Powder", brand: "Lumière Lab",
    price: 29.00, originalPrice: null, stock: 85, sold: 198, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p2.jpg"],
    description: "Micro-milled powder that diffuses light for a soft-focus, camera-ready finish.",
    formula: "Silica, Lauroyl Lysine, Magnesium Stearate, Kaolin, Tocopheryl Acetate.",
    shades: ["Light", "Medium", "Deep"],
    tags: ["new"],
  },
  {
    id: "p3", categoryId: "c2",
    name: "Amethyst Dreams Palette", brand: "Velour Beauty",
    price: 52.00, originalPrice: 65.00, stock: 67, sold: 521, featured: true,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p3.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p3.jpg"],
    description: "12-pan palette ranging from soft lavenders to smoky deep plums. Mattes, satins & glitters.",
    formula: "Talc, Mica, Magnesium Stearate, Dimethicone. Paraben-free.",
    shades: ["Multi-palette"],
    tags: ["bestseller", "cruelty-free"],
  },
  {
    id: "p4", categoryId: "c2",
    name: "Gilded Hour Single Shadow", brand: "Aurore",
    price: 18.00, originalPrice: null, stock: 210, sold: 87, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p4.jpg"],
    description: "Intensely pigmented mono shadow with a buttery texture. Layer or blend solo.",
    formula: "Mica, Synthetic Fluorphlogopite, Talc, Silica, Alumina.",
    shades: ["Gold Rush", "Rose Quartz", "Midnight", "Copper Dusk", "Violet Haze"],
    tags: ["vegan"],
  },
  {
    id: "p5", categoryId: "c3",
    name: "Plush Velvet Lip Colour", brand: "Velour Beauty",
    price: 26.00, originalPrice: null, stock: 154, sold: 633, featured: true,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p5.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p5.jpg"],
    description: "Full-coverage matte that glides on like silk and stays put for 8 hours. Infused with jojoba oil.",
    formula: "Isododecane, Trimethylsiloxysilicate, Cyclopentasiloxane, Jojoba Seed Oil, Vitamin E.",
    shades: ["Berry Bliss", "Nude Ambition", "Crimson Crush", "Mauve Dream", "Terracotta Kiss"],
    tags: ["bestseller", "cruelty-free", "vegan"],
  },
  {
    id: "p6", categoryId: "c3",
    name: "Glass Glow Lip Gloss", brand: "Lumière Lab",
    price: 21.00, originalPrice: null, stock: 98, sold: 314, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p6.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p6.jpg"],
    description: "High-shine, non-sticky gloss with plumping peptides for a glassy finish.",
    formula: "Polybutene, Hydrogenated Polyisobutene, Octyldodecanol, Hexylresorcinol.",
    shades: ["Crystal Clear", "Pink Haze", "Coral Pop", "Berry Sheer"],
    tags: ["new", "vegan"],
  },
  {
    id: "p7", categoryId: "c4",
    name: "Silk Canvas Serum Foundation", brand: "Velour Beauty",
    price: 48.00, originalPrice: 58.00, stock: 72, sold: 289, featured: true,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p7.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p7.jpg"],
    description: "Lightweight serum-foundation hybrid. Medium-to-full buildable coverage with skincare benefits.",
    formula: "Water, Cyclopentasiloxane, Niacinamide, Hyaluronic Acid, SPF 30. 42 shades.",
    shades: ["N10", "N20", "W20", "W30", "C10", "C20", "N40", "W40"],
    tags: ["bestseller", "cruelty-free"],
  },
  {
    id: "p8", categoryId: "c5",
    name: "Petal Flush Blush Duo", brand: "Aurore",
    price: 32.00, originalPrice: null, stock: 115, sold: 178, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p8.jpg"],
    description: "Finely milled powder blush duo with a matte shade and a pearl-infused highlight.",
    formula: "Talc, Mica, Kaolin, Zinc Stearate, Tocopheryl Acetate. Paraben-free.",
    shades: ["Peach & Champagne", "Rose & Gold", "Berry & Silver"],
    tags: ["vegan"],
  },
  {
    id: "p9", categoryId: "c6",
    name: "Noir Lash Amplifier Mascara", brand: "Velour Beauty",
    price: 28.00, originalPrice: null, stock: 203, sold: 741, featured: true,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p9.jpg"],
    description: "Buildable, clump-free formula with a curved brush. Adds volume, length & curl — smudge-proof.",
    formula: "Water, Beeswax, Carnauba Wax, Stearic Acid, Iron Oxides. Ophthalmologist tested.",
    shades: ["Noir Black", "Deep Brown"],
    tags: ["bestseller"],
  },
  {
    id: "p10", categoryId: "c7",
    name: "Dewy Prep Moisturising Primer", brand: "Velour Beauty",
    price: 34.00, originalPrice: null, stock: 88, sold: 456, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p10.jpg"],
    description: "Hydrating primer that smooths and plumps skin while extending foundation wear.",
    formula: "Water, Glycerin, Dimethicone, Squalane, Centella Asiatica, Sodium Hyaluronate.",
    shades: ["Universal"],
    tags: ["vegan", "cruelty-free"],
  },
  {
    id: "p11", categoryId: "c2",
    name: "Rose Gold Shimmer Topper", brand: "Aurore",
    price: 22.00, originalPrice: null, stock: 144, sold: 203, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p11.jpg"],
    description: "Blinding duochrome topper that transforms any look into something extraordinary.",
    formula: "Mica, Synthetic Fluorphlogopite, Boron Nitride, Cyclopentasiloxane.",
    shades: ["Rose Gold", "Champagne", "Holographic"],
    tags: ["new", "vegan"],
  },
  {
    id: "p12", categoryId: "c7",
    name: "Barrier Shield SPF 50 Sunscreen", brand: "Lumière Lab",
    price: 42.00, originalPrice: 55.00, stock: 63, sold: 312, featured: false,
    image: "http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg",
    images: ["http://site53742-qpl6iw.scloudsite101.com/velour/assets/products/p12.jpg"],
    description: "Invisible SPF 50 PA++++ sunscreen that doubles as a makeup primer. No white cast.",
    formula: "Zinc Oxide, Titanium Dioxide, Niacinamide, Centella Asiatica, Tocopherol.",
    shades: ["Universal"],
    tags: ["vegan", "cruelty-free"],
  },
];

const reviews = [
  { id: "r1", productId: "p1", userId: "u2", userName: "Sara J.", rating: 5, title: "Holy grail powder!", body: "Stays matte all day and never looks cakey. Worth every penny.", helpful: 24, verified: true, createdAt: "2024-03-10T00:00:00.000Z" },
  { id: "r2", productId: "p1", userId: "u2", userName: "Mia T.", rating: 4, title: "Great but pricey", body: "Beautiful finish and long-lasting. Knocked off one star for the price point.", helpful: 11, verified: true, createdAt: "2024-04-02T00:00:00.000Z" },
  { id: "r3", productId: "p3", userId: "u2", userName: "Leyla R.", rating: 5, title: "Stunning palette", body: "The pigmentation is incredible. The glitter shades are blinding. Perfect for day to night looks.", helpful: 38, verified: true, createdAt: "2024-02-20T00:00:00.000Z" },
  { id: "r4", productId: "p5", userId: "u2", userName: "Priya S.", rating: 5, title: "Best matte lipstick ever", body: "Doesn't dry out my lips! Finally a matte that stays comfortable. The Berry Bliss shade is perfect.", helpful: 52, verified: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: "r5", productId: "p7", userId: "u2", userName: "Nina K.", rating: 5, title: "My new foundation!", body: "Lightweight but buildable. The niacinamide has noticeably improved my skin texture over time.", helpful: 29, verified: true, createdAt: "2024-04-10T00:00:00.000Z" },
  { id: "r6", productId: "p9", userId: "u2", userName: "Aisha M.", rating: 5, title: "No more clumps!", body: "Finally a mascara that gives volume without clumping. I'm completely obsessed with this formula.", helpful: 41, verified: true, createdAt: "2024-03-25T00:00:00.000Z" },
];

const orders = [
  {
    id: "ord1",
    userId: "u2",
    items: [
      { productId: "p1", name: "Velvet Veil Setting Powder", shade: "Translucent", qty: 1, price: 38.00 },
      { productId: "p5", name: "Plush Velvet Lip Colour", shade: "Berry Bliss", qty: 2, price: 26.00 },
    ],
    subtotal: 90.00, discount: 0, shipping: 5.99, tax: 7.20, total: 103.19,
    status: "delivered",
    trackingNumber: "VB8472910283",
    shippingAddress: { name: "Sara Johnson", street: "123 Bloom St", city: "Los Angeles", state: "CA", zip: "90001", country: "US" },
    paymentMethod: "card",
    createdAt: "2024-04-01T10:00:00.000Z",
    timeline: [
      { status: "placed",    label: "Order Placed",      date: "2024-04-01T10:00:00.000Z" },
      { status: "confirmed", label: "Order Confirmed",   date: "2024-04-01T12:00:00.000Z" },
      { status: "packed",    label: "Packed & Ready",    date: "2024-04-02T09:00:00.000Z" },
      { status: "shipped",   label: "Shipped",           date: "2024-04-02T15:00:00.000Z" },
      { status: "out",       label: "Out for Delivery",  date: "2024-04-05T08:00:00.000Z" },
      { status: "delivered", label: "Delivered",         date: "2024-04-05T16:00:00.000Z" },
    ],
  },
];

// السلال — تُخزَّن بـ userId
const carts = {
  u2: [{ productId: "p7", shade: "W30", qty: 1 }],
};

// قوائم المفضلة — تُخزَّن بـ userId
const wishlists = {
  u2: ["p3", "p7"],
};

// أكواد الخصم
const promoCodes = [
  { code: "VELOUR20",  type: "percent", value: 0.20, minOrder: 50 },
  { code: "WELCOME10", type: "flat",    value: 10,   minOrder: 0  },
];


module.exports = { users, categories, products, reviews, orders, carts, wishlists, promoCodes };
