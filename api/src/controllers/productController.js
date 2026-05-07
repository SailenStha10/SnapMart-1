// Placeholder product controller
export const listProducts = (req, res) => {
  res.json({ message: 'List products - placeholder', products: [] })
}

export const getProduct = (req, res) => {
  res.json({ message: 'Get product - placeholder', id: req.params.id })
}
