import mongoose from 'mongoose'

let dbConnected = false

export const isDatabaseConnected = () => dbConnected

// Connect to MongoDB (supports local or Atlas via MONGODB_URI)
export default async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snapmart'

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    dbConnected = true
    console.log('MongoDB connected')
  } catch (err) {
    dbConnected = false
    console.error('MongoDB connection error:', err.message)
    console.warn('Falling back to in-memory demo data for this session.')
  }
}
