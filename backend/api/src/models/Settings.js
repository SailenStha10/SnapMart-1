import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'My Store' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  adminAccessLevel: { type: String, enum: ['full', 'limited'], default: 'full' },
  autoRefreshInterval: { type: Number, default: 30 }, // seconds
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)
