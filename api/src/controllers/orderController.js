export const createOrder = (req, res) => {
  res.status(201).json({ orderId: null })
}

export const listOrders = (req, res) => {
  res.json({ orders: [] })
}
