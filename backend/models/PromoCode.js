const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 }
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
