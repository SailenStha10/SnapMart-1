import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { isDatabaseConnected } from '../../config/db.js'
import crypto from 'crypto'

export const createOrder = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ message: 'Database not available' })
    }

    const {
      items = [],
      shippingAddress = {},
      paymentMethod,
      deliveryOption,
      subtotal = 0,
      deliveryFee = 0,
      discount = 0,
      total = 0,
    } = req.body

    if (!items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' })
    }

    // Build order items with product refs where possible
    const orderItems = []
    for (const it of items) {
      const prodId = it.productId || it.product || it.id || null
      let productRef = null
      if (prodId) {
        const prod = await Product.findById(prodId)
        if (prod) {
          productRef = prod._id
        }
      }

      orderItems.push({
        product: productRef,
        name: it.name || '',
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || 0,
      })
    }

    // Validate stock availability before creating order
    for (const it of orderItems) {
      if (!it.product) continue
      const prod = await Product.findById(it.product)
      if (!prod) {
        return res.status(400).json({ message: `Product not found: ${it.name}` })
      }
      if ((prod.stock || 0) < it.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}`, productId: prod._id.toString(), available: prod.stock || 0 })
      }
    }

    // generate short order code (5 chars)
    const generateCode = () => crypto.randomBytes(3).toString('hex').slice(0,5).toUpperCase()
    let orderCode = generateCode()
    // ensure uniqueness (very low collision chance) up to a few attempts
    for (let i = 0; i < 5; i++) {
      const exists = await Order.findOne({ orderCode })
      if (!exists) break
      orderCode = generateCode()
    }

    const order = await Order.create({
      user: req.user?.id || undefined,
      items: orderItems,
      orderCode,
      shippingAddress,
      paymentMethod,
      deliveryOption,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: 'confirmed',
    })

    // decrement product stock
    for (const it of orderItems) {
      if (!it.product) continue
      try {
        await Product.findByIdAndUpdate(it.product, { $inc: { stock: -Math.max(0, it.quantity) } })
      } catch (e) {
        // ignore stock update failures
      }
    }

    return res.status(201).json({ orderId: order._id, orderCode })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const listOrders = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json({ orders: [] })
    }

    const orders = await Order.find({}).populate('user').sort({ createdAt: -1 })

    const mapped = orders.map((o) => ({
      id: o._id,
      orderCode: o.orderCode,
      user: o.user ? { id: o.user._id, name: o.user.name, email: o.user.email } : null,
      items: o.items.map((it) => ({ name: it.name, qty: it.quantity, price: it.price })),
      subtotal: o.subtotal,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }))

    const totalSales = orders.reduce((s, o) => s + (Number(o.total) || 0), 0)

    return res.json({ orders: mapped, summary: { totalOrders: orders.length, totalSales } })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}
