import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB, { isDatabaseConnected } from '../config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import categoryRoutes from './routes/categoryRoutes.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { scheduleCartCleanup } from './utils/cartCleanup.js'
import userRoutes from './routes/userRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())
app.use(authMiddleware)  // Set req.user globally (works for both auth and guest)

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' })
  }
  next(err)
})

// Connect to DB (config lives in ../config)
await connectDB()

app.use((req, res, next) => {
  req.isDatabaseAvailable = isDatabaseConnected()
  next()
})

// Lightweight health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: isDatabaseConnected() })
})

// Schedule cart cleanup for expired guest carts
scheduleCartCleanup()

// API routes (under src/routes)
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/user', userRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/admin', adminRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log(`API server running on port ${PORT}`)
})
