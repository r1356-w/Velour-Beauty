const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  formula: { type: String, required: true },
  shades: [{ type: String }],
  tags: [{ type: String }]
});

module.exports = mongoose.model('Product', productSchema);
