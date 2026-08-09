import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'My Store' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)
