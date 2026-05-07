import mongoose from 'mongoose'

// Connect to MongoDB (config located outside src)
export default function connectDB(){
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snapmart'
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('MongoDB connected'))
    .catch(err=> console.error('MongoDB connection error:', err.message))
}
