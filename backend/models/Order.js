const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
  image:     { type: String },
});

const orderSchema = new mongoose.Schema({
  orderId:         { type: String, unique: true },
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  totalAmount:     { type: Number, required: true },
  status:          { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'], default: 'pending' },
  paymentMethod:   { type: String, enum: ['cod', 'esewa', 'khalti'], required: true },
  paymentStatus:   { type: String, enum: ['unpaid', 'paid', 'failed'], default: 'unpaid' },
  deliveryOption:  { type: String, default: 'instant' },
  subtotal:        { type: Number },
  deliveryFee:     { type: Number, default: 0 },
  discount:        { type: Number, default: 0 },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone:    { type: String, required: true },
    email:    { type: String },
    address:  { type: String, required: true },
    landmark: { type: String },
    city:     { type: String, required: true },
    zipCode:  { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);