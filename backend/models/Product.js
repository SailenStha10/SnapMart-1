import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  images: [String],
  stock: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
