import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Settings from '../models/Settings.js'
import { isDatabaseConnected } from '../../config/db.js'
import { getFallbackProducts, getFallbackUser } from '../utils/fallbackData.js'

export async function listUsers(req, res) {
  if (!isDatabaseConnected()) {
    const fb = getFallbackUser()
    return res.json({ users: [{ id: fb._id, name: fb.name, email: fb.email, role: fb.role, created_at: new Date().toISOString() }] })
  }

  const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 })
  const mapped = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.createdAt,
  }))
  return res.json({ users: mapped })
}

export async function getStats(req, res) {
  if (!isDatabaseConnected()) {
    const products = getFallbackProducts()
    return res.json({
      usersCount: 1,
      productsCount: products.length,
      ordersCount: 0,
      totalSales: 0,
      estimatedProfit: 0,
    })
  }

  const usersCount = await User.countDocuments()
  const productsCount = await Product.countDocuments()
  const orders = await Order.find({})
  const ordersCount = orders.length
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  // Simple profit estimate: assume 30% margin
  const estimatedProfit = Math.round(totalSales * 0.3)

  return res.json({
    usersCount,
    productsCount,
    ordersCount,
    totalSales,
    estimatedProfit,
  })
}

export async function getSettings(req, res) {
  if (!isDatabaseConnected()) {
    return res.json({ settings: { storeName: 'My Store', theme: 'light' } })
  }

  let settings = await Settings.findOne({})

  if (!settings) {
    settings = await Settings.create({ storeName: 'My Store', theme: 'light' })
  }

  return res.json({ settings })
}

export async function updateSettings(req, res) {
  const payload = {}
  if (req.body.storeName !== undefined) payload.storeName = String(req.body.storeName).trim()
  if (req.body.theme !== undefined) payload.theme = String(req.body.theme).trim()
  if (!isDatabaseConnected()) {
    const merged = { storeName: payload.storeName || 'My Store', theme: payload.theme || 'light' }
    return res.json({ settings: merged })
  }

  let settings = await Settings.findOne({})
  if (!settings) {
    settings = await Settings.create(payload)
  } else {
    Object.assign(settings, payload)
    await settings.save()
  }

  return res.json({ settings })
}

export default {
  listUsers,
  getStats,
  getSettings,
  updateSettings,
}
