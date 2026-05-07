export const listProducts = (req, res) => {
  res.json({ products: [] })
}

export const getProduct = (req, res) => {
  res.json({ product: null, id: req.params.id })
}
