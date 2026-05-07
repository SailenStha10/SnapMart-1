// Placeholder order controller
export const createOrder = (req, res) => {
  res.status(201).json({ message: 'Create order - placeholder' })
}

export const listOrders = (req, res) => {
  res.json({ message: 'List orders - placeholder', orders: [] })
}
