import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 }
})

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String },
  items: [cartItemSchema],
  isGuestCart: { type: Boolean, default: false },
  expiresAt: { type: Date }
}, { timestamps: true })

cartSchema.index({ sessionId: 1 })
cartSchema.index({ user: 1 })

export default mongoose.model('Cart', cartSchema)
