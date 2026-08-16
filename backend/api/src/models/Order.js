import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
})

const shippingSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  address: String,
  landmark: String,
  city: String,
  zipCode: String,
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [orderItemSchema],
  orderCode: { type: String, index: true, unique: false },
  shippingAddress: shippingSchema,
  paymentMethod: { type: String },
  deliveryOption: { type: String },
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
