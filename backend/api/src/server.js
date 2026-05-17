import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import categoryRoutes from './routes/categoryRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'

dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())
app.use(authMiddleware)  // Set req.user globally

// Connect to DB (config lives in ../config)
connectDB()

// API routes (under src/routes)
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log(`API server running on port ${PORT}`)
})
