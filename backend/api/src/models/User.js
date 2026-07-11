import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  password: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isGuest: { type: Boolean, default: false },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  sessionId: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
