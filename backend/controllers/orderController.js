const Order = require('../models/Order')

const formatOrder = (order) => ({
  id: order._id,
  customerName: order.userId?.name || 'Unknown customer',
  customerEmail: order.userId?.email || 'No email available',
  totalAmount: order.totalAmount,
  status: order.status,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
  shippingAddress: order.shippingAddress,
  createdAt: order.createdAt,
})

const createSummary = (orders) =>
  orders.reduce(
    (summary, order) => {
      summary.totalOrders += 1

      if (order.paymentStatus === 'paid') {
        summary.paidPayments += 1
      }

      if (order.paymentStatus === 'failed') {
        summary.failedPayments += 1
      }

      if (order.status === 'delivered') {
        summary.deliveredOrders += 1
      }

      if (order.status === 'processing' || order.status === 'shipped') {
        summary.activeDeliveries += 1
      }

      return summary
    },
    {
      totalOrders: 0,
      paidPayments: 0,
      failedPayments: 0,
      deliveredOrders: 0,
      activeDeliveries: 0,
    },
  )

exports.createOrder = async (req, res) => {
  try {
    const { 
      items = [], 
      totalAmount, 
      total, 
      paymentMethod, 
      shippingAddress, 
      status = 'processing', 
      paymentStatus = 'pending',
      deliveryOption,
      subtotal,
      deliveryFee,
      discount
    } = req.body

    // Use either totalAmount or total (frontend sends total)
    const finalTotalAmount = totalAmount || total

    if (!items.length || !shippingAddress || !paymentMethod || typeof finalTotalAmount === 'undefined') {
      return res.status(400).json({ message: 'Items, total amount, payment method, and shipping address are required.' })
    }

    // Generate a custom order ID
    const orderId = `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = await Order.create({
      orderId,
      userId: req.user.id,
      items,
      totalAmount: finalTotalAmount,
      paymentMethod,
      shippingAddress,
      status,
      paymentStatus,
      deliveryOption,
      subtotal,
      deliveryFee,
      discount,
    })

    return res.status(201).json({
      message: 'Order created successfully',
      orderId: order.orderId,
      order: formatOrder(order),
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return res.status(500).json({ message: 'Unable to create order', error: error.message })
  }
}

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    const formattedOrders = orders.map(formatOrder)

    return res.json({
      orders: formattedOrders,
      summary: createSummary(formattedOrders),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load orders', error: error.message })
  }
}
