const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    qty: Number,
    price: Number
  }],
  shippingAddress: {
    city: String,
    district: String,
    state: String,
    pin: String,
    lat: Number,
    lng: Number
  },
  paymentMethod: String,
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
  tracking: [{
    status: String,
    note: String,
    at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
