import Cart from '../models/Cart.js'

export const cleanupExpiredGuestCarts = async () => {
  try {
    const now = new Date()
    const result = await Cart.deleteMany({
      isGuestCart: true,
      expiresAt: { $lt: now }
    })
    
    console.log(`Cleaned up ${result.deletedCount} expired guest carts`)
    return result.deletedCount
  } catch (error) {
    console.error('Error cleaning up expired guest carts:', error)
    return 0
  }
}

export const scheduleCartCleanup = () => {
  setInterval(cleanupExpiredGuestCarts, 60 * 60 * 1000) // Run every hour
  console.log('Scheduled cart cleanup to run every hour')
}
