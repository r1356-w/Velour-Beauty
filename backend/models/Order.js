const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  shade: { type: String },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true }
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  label: { type: String, required: true },
  date: { type: Date, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'out', 'delivered'], default: 'placed' },
  trackingNumber: { type: String },
  shippingAddress: addressSchema,
  paymentMethod: { type: String, required: true },
  timeline: [timelineSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
