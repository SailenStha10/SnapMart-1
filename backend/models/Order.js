const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
  image:     { type: String },
});

const orderSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  totalAmount:     { type: Number, required: true },
  status:          { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'], default: 'pending' },
  paymentMethod:   { type: String, enum: ['cod', 'esewa', 'khalti'], required: true },
  paymentStatus:   { type: String, enum: ['unpaid', 'paid', 'failed'], default: 'unpaid' },
  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String },
    zip:     { type: String },
    country: { type: String, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);